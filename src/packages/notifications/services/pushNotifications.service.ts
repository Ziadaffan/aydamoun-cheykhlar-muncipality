import { PushTokensRepository } from '../repository/pushTokens.repository';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
// Expo accepts at most 100 messages per request.
const BATCH_SIZE = 100;
const TOKEN_PATTERN = /^Expo(nent)?PushToken\[[^\]]+\]$/;
const PLATFORMS = ['ios', 'android'];

export interface PushMessage {
  title: string;
  body: string;
  /** App route opened when the notification is tapped, e.g. /news/<id>. */
  path: string;
}

type PushTicket = { status: 'ok'; id: string } | { status: 'error'; message: string; details?: { error?: string } };

export function isValidPushToken(token: unknown): token is string {
  return typeof token === 'string' && TOKEN_PATTERN.test(token);
}

export function isValidPlatform(platform: unknown): platform is string {
  return typeof platform === 'string' && PLATFORMS.includes(platform);
}

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

  public async register(token: string, platform: string) {
    await this.repository.upsert(token, platform);
  }

  /**
   * Sends one message to every registered install. Never throws: a failed
   * push must not fail the request that created the content.
   */
  public async broadcast(message: PushMessage): Promise<void> {
    try {
      const tokens = (await this.repository.findAllTokens()).map((row) => row.token);
      const stale: string[] = [];

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

      if (stale.length) await this.repository.deleteMany(stale);
    } catch (error) {
      console.error('Error sending push notifications:', error);
    }
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
        tokens.map((to) => ({
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
