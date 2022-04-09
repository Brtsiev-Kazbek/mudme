// import bcrypt from 'bcrypt';
// import FileManager from './FileManager';

import IAccount from './interfaces/IAccount';
import ICrypt from './interfaces/ICrypt';

export default class Account implements IAccount {
    username: string;
    characters: any[];
    password: string;
    banned: boolean;
    deleted: boolean;
    metadata: object;

    constructor(private readonly crypt: ICrypt , accountParameters: AccountParameters) {
        this.username = accountParameters.username;
        this.characters = accountParameters.characters || [];
        this.password = accountParameters.password;
        this.banned = accountParameters.banned || false;
        this.deleted = accountParameters.deleted || false;
        // Arbitrary data bundles are free to shove whatever they want in
        // WARNING: values must be JSON.stringify-able
        this.metadata = accountParameters.metadata || {};
    }

    /**
     * @returns {string} username
     */
    getUsername(): string {
        return this.username;
    }

    /**
     * @param {string} username
     */
    addCharacter(username: string): void {
        this.characters.push({username: username, deleted: false});
    }

    /**
     * 
     * @param {string} username
     * @returns {boolean}
     */
    hasCharacter(username: string): boolean {
        return this.characters.find(ch => ch.username === username);
    }

    /**
     * @param {string} username Delete one of the chars
     */
    deleteCharacter(username: string): void {
        const picked = this.characters.find(ch => ch.username === username);
        if(picked) {
            picked.deleted = true;
            this.save();
        }
    }

    /**
     * @param {string} username Removes the deletion of one of the chars
     */
    undeleteCharacter(username: string): void {
        const picked = this.characters.find(c => c.username === username);
        if(picked) {
            picked.deleted = true;
            this.save();
        }
    }

    /**
     * @param {string} password Unhashed password. Is hashed inside this function
     */
    setPassword(password: string): void {
        this.password = this.crypt.hashPassword(password);
        this.save();
    }

    /**
     * @param {string} password Unhashed password to check against account's password
     * @return {boolean}
     */
    checkPassword(password: string): boolean {
        password = this.crypt.hashPassword(password);
        return this.crypt.compare(this.password, password);
    }

    /**
     * @param {function} callback after-save callback
     */
    save(callback?: () => unknown): void {
        FileManager.save('account', this.username, this.serialize(), callback);
    }

    /**
     * Set this account to banned
     There is no unban because this can just be done by manually editing the account file
     */
    ban() {
        this.banned = true;
        this.save();
    }

    /**
     * Set this account to deleted
     There is no undelete because this can just be done by manually editing the account file
     */
    deleteAccount(): void {
        this.characters.forEach(char => {
            this.deleteCharacter(char.username);
        });
        this.deleted = true;
        this.save();
    }

    serialize(): object {
        const {
            username,
            characters,
            password,
            metadata,
        } = this;

        return {
            username,
            characters,
            password,
            metadata,
        };
    }

}