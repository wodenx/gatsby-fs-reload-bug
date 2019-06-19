import React from "react"
import { graphql } from 'gatsby';

import Layout from "../components/layout"

const IndexPage = ({ data }) => (
  <Layout>
    <h1>Home Page</h1>
    <p>Contents of data prop</p>
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  </Layout>
)

export default IndexPage
export const query = graphql`
  query {
    allFile {
      nodes {
        name
        size
        changeTime
      }
    }
  }
`;