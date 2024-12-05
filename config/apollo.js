import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import fetch from "node-fetch";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: 'http://localhost:4000/graphql',
        fetch
    })
})
export default client;