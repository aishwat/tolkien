type GenerateResp = { created: number; tokens: string[] };
type TokenStatus = { status: 'available' | 'redeemed' | 'expired' };
type RedeemStatus = {result: 'ok' | 'redeemed' | 'expired'};
