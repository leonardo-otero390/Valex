import { Card } from '../interfaces/Card';

export type CardInsertData = Omit<Card, 'id'>;
export type CardUpdateData = Partial<Card>;
