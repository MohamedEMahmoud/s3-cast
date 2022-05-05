import pg, { ClientConfig, QueryResult } from 'pg';

class Pool {
  private _pool?: pg.Pool;

  connect(options: ClientConfig): Promise<pg.QueryResult<any>> {
    this._pool = new pg.Pool(options);
    return this._pool.query('SELECT 1+1;');
  }

  close(): Promise<void> | undefined {
    return this._pool?.end();
  }

  query(sql: string, params?: any[]): Promise<QueryResult<any>> | undefined {
    return this._pool?.query(sql, params);
  }
}

export = new Pool();
