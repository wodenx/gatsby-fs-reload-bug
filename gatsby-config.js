module.exports = {
  siteMetadata: {
    title: `Gatsby 2.9 FS Data Refresh Issue`,
    description: `Illustrates a problem in Gatsby 2.9`,
    author: 'coden@its.jnj.com',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: './src/data/',
      },
    }
  ],
}
