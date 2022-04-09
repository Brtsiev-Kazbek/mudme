import Account from "./Account";

/**
 * Creates/loads {@linkplain Account|Accounts}
 * @property {Map<string,Account>} accounts
 * @property {EntityLoader} loader
 */
export default class AccountManager {
    private accounts: Map<string, Account>;
    private loader: any;

    constructor() {
        this.accounts = new Map();
        this.loader = null;
    }

    /**
     * Set the entity loader from which accounts are loaded
     * @param {EntityLoader}
     */
    setLoader(loader: EntityLoader): void {
        this.loader = loader;
    }

    /**
     * 
     * @param {Account} account 
     */
    addAccount(account: Account): void {
        this.accounts.set(account.username, account)
    }

    /**
     * @param {string} username
     * @return {Account | undefined}
     */
    getAccount(username: string): Account | undefined {
        return this.accounts.get(username);
    }

    /**
     * @param {string} username
     * @param {boolean} force Force reload data from disk
     */
    async loadAccount(username: string, force: boolean) {
        if(this.accounts.has(username) && !force) {
            return this.getAccount(username)
        }

        if(!this.loader) {
            throw new Error('No entity loader configured for accounts');
        }

        const accountParameters = await this.loader.fetch(username)

        const account = new Account(accountParameters);
        this.addAccount(account);

        return account;
    }
}