export default interface IAccount {
    getUsername(): string;
    addCharacter(username: string): void;
    hasCharacter(username: string): boolean;
    deleteCharacter(username: string): void;
    undeleteCharacter(username:string): void;
    setPassword(password: string): void;
    checkPassword(password: string): boolean;
    save(callback?: () => unknown): void;
    ban(): void;
    deleteAccount(): void;
    serialize(): object;
}