import { PushTokensRepository } from '../repository/pushTokens.repository';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
// Expo accepts at most 100 messages per request.
const BATCH_SIZE = 100;
const TOKEN_PATTERN = /^Expo(nent)?PushToken\[[^\]]+\]$/;
const PLATFORMS = ['ios', 'android'];

/** What an install can subscribe to; every new install starts with all of them. */
export const PUSH_TOPICS = ['announcements', 'news', 'jobs', 'taxiStops', 'requests'] as const;
export type PushTopic = (typeof PUSH_TOPICS)[number];

export const PUSH_LOCALES = ['ar', 'en'] as const;
export type PushLocale = (typeof PUSH_LOCALES)[number];

export interface PushMessage {
  title: string;
  body: string;
  /** App route opened when the notification is tapped, e.g. /news/<id>. */
  path: string;
}

/** Builds the message in the install's language. */
export type PushMessageBuilder = (locale: PushLocale) => PushMessage;

type PushTicket = { status: 'ok'; id: string } | { status: 'error'; message: string; details?: { error?: string } };

export function isValidPushToken(token: unknown): token is string {
  return typeof token === 'string' && TOKEN_PATTERN.test(token);
}

export function isValidPlatform(platform: unknown): platform is string {
  return typeof platform === 'string' && PLATFORMS.includes(platform);
}

export function isValidLocale(locale: unknown): locale is PushLocale {
  return typeof locale === 'string' && (PUSH_LOCALES as readonly string[]).includes(locale);
}

/** True for an array of known topics (an empty array is valid: every topic switched off). */
export function isValidTopics(topics: unknown): topics is PushTopic[] {
  return Array.isArray(topics) && topics.every(topic => typeof topic === 'string' && (PUSH_TOPICS as readonly string[]).includes(topic));
}

const toLocale = (value: string | null | undefined): PushLocale => (value === 'en' ? 'en' : 'ar');

export type RegisterPushToken = {
  token: string;
  platform: string;
  locale?: PushLocale;
  topics?: PushTopic[];
  /** See PushTokensRepository.upsert. */
  userId?: string | null;
};

export class PushNotificationsService {
  private static singleton: PushNotificationsService;
  private readonly repository: PushTokensRepository;

  constructor(repository: PushTokensRepository = new PushTokensRepository()) {
    this.repository = repository;
  }

  public static instance(): PushNotificationsService {
    if (!PushNotificationsService.singleton) {
      PushNotificationsService.singleton = new PushNotificationsService();
    }
    return PushNotificationsService.singleton;
  }

  public async register({ token, platform, locale, topics, userId }: RegisterPushToken) {
    // Duplicates would only mean duplicate entries in the array.
    const uniqueTopics = topics ? Array.from(new Set(topics)) : undefined;
    await this.repository.upsert({ token, platform, locale, topics: uniqueTopics, userId });
  }

  /** The user turned notifications off on that install. */
  public async unregister(token: string) {
    await this.repository.deleteByToken(token);
  }

  /**
   * Sends to every install subscribed to `topic`, each in its own language. Never
   * throws: a failed push must not fail the request that created the content.
   */
  public async broadcast(topic: PushTopic, build: PushMessageBuilder): Promise<void> {
    try {
      await this.sendToRows(await this.repository.findByTopic(topic), build);
    } catch (error) {
      console.error(`Error sending "${topic}" push notifications:`, error);
    }
  }

  /** Same as broadcast, limited to one user's installs. Never throws. */
  public async sendToUser(userId: string, topic: PushTopic, build: PushMessageBuilder): Promise<void> {
    try {
      await this.sendToRows(await this.repository.findByUserAndTopic(userId, topic), build);
    } catch (error) {
      console.error(`Error sending "${topic}" push notification to user ${userId}:`, error);
    }
  }

  private async sendToRows(rows: { token: string; locale: string }[], build: PushMessageBuilder) {
    const byLocale = new Map<PushLocale, string[]>();
    for (const row of rows) {
      const locale = toLocale(row.locale);
      byLocale.set(locale, [...(byLocale.get(locale) ?? []), row.token]);
    }

    const stale: string[] = [];
    for (const [locale, tokens] of Array.from(byLocale)) {
      const message = build(locale);
      for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
        const batch = tokens.slice(i, i + BATCH_SIZE);
        const tickets = await this.send(batch, message);
        // Tickets come back in the order the messages were sent.
        tickets.forEach((ticket, index) => {
          if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
            stale.push(batch[index]);
          }
        });
      }
    }

    if (stale.length) await this.repository.deleteMany(stale);
  }

  private async send(tokens: string[], message: PushMessage): Promise<PushTicket[]> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    // Needed only if "enhanced push security" is turned on in the Expo project.
    if (process.env.EXPO_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
    }

    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(
        tokens.map(to => ({
          to,
          title: message.title,
          body: message.body,
          data: { path: message.path },
          sound: 'default',
          channelId: 'default',
        }))
      ),
    });

    if (!res.ok) {
      console.error('Expo push request failed:', res.status, await res.text().catch(() => ''));
      return [];
    }
    const json = (await res.json()) as { data?: PushTicket[] };
    return json.data ?? [];
  }
}
