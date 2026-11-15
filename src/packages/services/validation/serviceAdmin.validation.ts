import { ServiceType } from '@prisma/client';
import { BadRequestError } from '@/packages/common/errors';
import { definedOnly, fieldReaders } from '@/packages/common/utils/request-body.utils';
import { parseServiceFieldDefinitions, ServiceField, ServiceFieldsError } from '../utils/serviceFields';

/** Admin create/update of a service. Code: INVALID_SERVICE. */

export type ServiceInput = {
  name: string;
  description: string;
  nameEn: string | null;
  descriptionEn: string | null;
  type: ServiceType;
  /** null = the category defaults. */
  fields: ServiceField[] | null;
  active: boolean;
  order: number;
};

const CODE = 'INVALID_SERVICE';
const SERVICE_TYPES = Object.values(ServiceType) as ServiceType[];

/** A whole service (POST) or, with `partial`, only the fields present in the body (PUT). */
export function parseServiceInput(body: Record<string, unknown>, partial: true): Partial<ServiceInput>;
export function parseServiceInput(body: Record<string, unknown>, partial?: false): ServiceInput;
export function parseServiceInput(body: Record<string, unknown>, partial = false): Partial<ServiceInput> {
  const read = fieldReaders(body, CODE);

  let fields: ServiceField[] | null | undefined;
  if (body.fields !== undefined || !partial) {
    try {
      fields = parseServiceFieldDefinitions(body.fields);
    } catch (error) {
      if (error instanceof ServiceFieldsError) throw new BadRequestError(error.message, CODE);
      throw error;
    }
  }

  const input = {
    name: read.requiredText('name', 200, partial),
    description: read.requiredText('description', 2000, partial),
    // Optional English versions: '' or null clears one; absent leaves it as it was on an update.
    nameEn: partial ? read.optionalText('nameEn', 200) : (read.optionalText('nameEn', 200) ?? null),
    descriptionEn: partial ? read.optionalText('descriptionEn', 2000) : (read.optionalText('descriptionEn', 2000) ?? null),
    type: read.oneOf('type', SERVICE_TYPES, partial),
    fields,
    active: read.bool('active') ?? (partial ? undefined : true),
    order: read.int('order') ?? (partial ? undefined : 0),
  };

  return partial ? definedOnly(input) : (input as ServiceInput);
}
