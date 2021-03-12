import { Connection, createConnections, getConnectionOptions } from "typeorm";
import {createConnection} from "typeorm";

export default async (): Promise<Connection>=>{
    const defaultOptions = await getConnectionOptions();

    return createConnection(
     Object.assign(defaultOptions,{
         database:process.env.NODE_ENV === "test" ? "./src/database/data.teste.sqlite" : defaultOptions.database,
     })

    );
}
