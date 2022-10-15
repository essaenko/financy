import { fetchTransactions } from 'api/api.transaction';
import { TransactionCollectionState } from 'models/transaction.model';
import { defaultTransactionMock } from 'utils/test utils/data.mock';

jest.mock('api/api.transaction', () => {
  return {
    fetchTransactions: jest.fn(),
  };
});

describe('Transaction model test', () => {
  const defaultCollection = new TransactionCollectionState();

  it('Fetch transactions with default parameters', () => {
    (fetchTransactions as jest.Mock).mockReturnValue({
      success: true,
      payload: {
        total: 10,
        elements: 10,
        list: Array(10)
          .fill(1)
          .map((_, index) => ({
            ...defaultTransactionMock,
            id: index + 1,
          })),
      },
    });
    const promise = defaultCollection.fetchTransactions();

    promise.finally(() => {
      expect(fetchTransactions).toBeCalledWith(
        1, // Page
        30, // Items per page
        void 0, // Transactions type
        void 0, // Category
        void 0, // DateFrom filter
        void 0, // DateTo filter
        void 0, // Fixed date filter
      );
      expect(defaultCollection.collection.length).toBe(10);
    });
  });
});
