declare namespace SSHAgentClient {
    interface Key {
        type: string;
        ssh_key: string;
        comment: string;
    }

    interface Signature {
        type: Buffer;
        signature: string;
    }

    interface ClientOptions {
        timeout?: number;
    }
}

type requestIdentitiesCallback = (e: Error | null, keys: Array<SSHAgentClient.Key>) => any;
type signCallback = (e: Error | null, signature: SSHAgentClient.Signature) => any;

declare class SSHAgentClient {
    timeout: number;
    sockFile: string;
    constructor(options?: SSHAgentClient.ClientOptions);

    // На самом деле возвращает Socket
    // Ставлю void, чтобы этим никто не воспользовался и было проще стабать в тестах
    requestIdentities(callback: requestIdentitiesCallback): void;

    // На самом деле возвращает Socket
    // Ставлю void, чтобы этим никто не воспользовался и было проще стабать в тестах
    sign(key: SSHAgentClient.Key, data: Buffer, callback: signCallback): void;
}

export = SSHAgentClient;