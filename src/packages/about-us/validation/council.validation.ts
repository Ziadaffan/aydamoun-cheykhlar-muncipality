import { Position } from '@prisma/client';
import { BadRequestError } from '@/packages/common/errors';
import { definedOnly, fieldReaders } from '@/packages/common/utils/request-body.utils';
import { isValidPhone, normalizePhone } from '@/packages/common/utils/phone.utils';

/** Server-side checks of a council member (JSON or form data). Code: INVALID_COUNCIL_MEMBER. */

export type CouncilMemberInput = {
  name: string;
  position: Position;
  role: string | null;
  major: string | null;
  nameEn: string | null;
  roleEn: string | null;
  majorEn: string | null;
  phone: string | null;
  email: string | null;
  order: number;
};

const CODE = 'INVALID_COUNCIL_MEMBER';
export const COUNCIL_POSITIONS: readonly Position[] = ['PRESIDENT', 'VICE_PRESIDENT', 'COUNCIL_MEMBER'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseCouncilMemberInput(body: Record<string, unknown>, partial: true): Partial<CouncilMemberInput>;
export function parseCouncilMemberInput(body: Record<string, unknown>, partial?: false): CouncilMemberInput;
export function parseCouncilMemberInput(body: Record<string, unknown>, partial = false): Partial<CouncilMemberInput> {
  const read = fieldReaders(body, CODE);

  const rawPhone = read.optionalText('phone', 40);
  let phone: string | null | undefined = rawPhone;
  if (rawPhone) {
    phone = normalizePhone(rawPhone);
    if (!isValidPhone(phone)) throw new BadRequestError('Invalid phone number', 'INVALID_PHONE');
  }

  const rawEmail = read.optionalText('email', 254);
  const email = rawEmail ? rawEmail.toLowerCase() : rawEmail;
  if (email && !EMAIL.test(email)) throw new BadRequestError('Invalid email', 'INVALID_EMAIL');

  // Absent: unchanged on an update, null on a create. '' or null: cleared.
  const orNull = (value: string | null | undefined) => (value === undefined ? (partial ? undefined : null) : value);

  const input = {
    name: read.requiredText('name', 150, partial),
    position: read.oneOf('position', COUNCIL_POSITIONS, partial),
    role: orNull(read.optionalText('role', 200)),
    major: orNull(read.optionalText('major', 200)),
    nameEn: orNull(read.optionalText('nameEn', 150)),
    roleEn: orNull(read.optionalText('roleEn', 200)),
    majorEn: orNull(read.optionalText('majorEn', 200)),
    phone: orNull(phone),
    email: orNull(email),
    order: read.int('order') ?? (partial ? undefined : 0),
  };
  return partial ? definedOnly(input) : (input as CouncilMemberInput);
}
