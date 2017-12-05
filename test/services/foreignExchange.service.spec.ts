import { ForeignExchangeService } from '../../src/services/foreignExchange.service';

describe('ForeignExchangeService', () => {
  let foreignExchangeService: ForeignExchangeService;
  beforeEach(() => {
    foreignExchangeService = new ForeignExchangeService();
  });
  it('Test getSymbol', () => {
    expect(foreignExchangeService.getSymbol('USD')).toEqual('$');
    expect(foreignExchangeService.getSymbol('USD')).not.toEqual('€');
  });
});
