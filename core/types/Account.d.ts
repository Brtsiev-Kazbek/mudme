type AccountParameters = {
    username: string;
    characters: any[] | []; //FIXME: type character
    password: string;
    banned: boolean;
    deleted: boolean;
    metadata: object;
}