import { Position } from '@prisma/client';

export const getPositionLabel = (position: Position) => {
  switch (position) {
    case Position.PRESIDENT:
      return 'رئيس البلدية';
    case Position.VICE_PRESIDENT:
      return 'نائب رئيس البلدية';
    case Position.COUNCIL_MEMBER:
      return 'عضو لجنة البلدية';
  }
};
