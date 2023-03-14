export = SSHAgentClient;

type requestIdentitiesCallback = (e: Error | null, keys: Array<SSHAgent.Key>) => any;
type signCallback = (e: Error | null, signature: SSHAgent.Signature) => any;

declare class SSHAgentClient {
    timeout: number;
    sockFile: string;
    constructor(options?: SSHAgent.ClientOptions);

    // На самом деле возвращает Socket
    // Ставлю void, чтобы этим никто не воспользовался и было проще стабать в тестах
    requestIdentities(callback: requestIdentitiesCallback): void;

    // На самом деле возвращает Socket
    // Ставлю void, чтобы этим никто не воспользовался и было проще стабать в тестах
    sign(key: SSHAgent.Key, data: Buffer, callback: signCallback): void;
}

declare const SSHAgentClient: SSHAgentClient;
