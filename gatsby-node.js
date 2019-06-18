/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 *
 */
const pathUtil = require('path');
const slash = require('slash');
const fs = require('fs');

const findFilesystemNode = ({ node, getNode }) => {
  // Find the filesystem node.
  const types = ['File', 'Directory'];
  let fsNode = node;
  let whileCount = 0;

  while (
    !types.includes(fsNode.internal.type)
    && fsNode.parent
    && getNode(fsNode.parent) !== undefined
    && whileCount < 101
  ) {
    fsNode = getNode(fsNode.parent);
    whileCount += 1;

    if (whileCount > 100) {
      console.warn('Cannot find a directory node for ', fsNode);
    }
  }
  return fsNode;
};

// Adapted from create-file-path.
const createSlug = ({ node, getNode }) => {
  // Find the filesystem node
  const fsNode = findFilesystemNode({ node, getNode });
  if (!fsNode) return undefined;
  const relativePath = pathUtil.posix.relative(
    slash('pages'),
    slash(fsNode.relativePath),
  );
  const { dir, name } = pathUtil.parse(relativePath);
  const dirFragment = dir || '';
  const nameFragment = fsNode.internal.type === 'Directory' ? name : '';
  const slug = pathUtil.posix.join('/', dirFragment, nameFragment, '/');
  const finalSlug = relativePath.startsWith('..') ? `..${slug}` : slug;
  return finalSlug;
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'RawCode') {
    createNodeField({
      node,
      name: 'slug',
      value: createSlug({ node, getNode }),
    });
  }
};

exports.createPages = ({ actions, graphql, getNode }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allDirectory(filter: { relativePath: { regex: "/^pages/" } }) {
          edges {
            node {
              absolutePath
              relativePath
              relativeDirectory
              internal {
                type
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        console.log(result.errors);
        return reject(result.errors);
      }
      result.data.allDirectory.edges.forEach(({ node }) => {
        const templateBasePath = ['.', 'src', 'templates'];
        const dataBasePath = ['.', 'src', 'data'];
        const slug = createSlug({ node, getNode });
        const pageData = {
          path: slug,
          component: pathUtil.resolve(...templateBasePath, '_default.jsx'),
          context: {
            slug,
          },
        };
        try {
          // Look for an index.jsx.
          const indexJsx = pathUtil.resolve(
            ...dataBasePath,
            node.relativePath,
            'index.jsx',
          );
          if (fs.existsSync(indexJsx)) {
            pageData.component = indexJsx;
          } else {
            const indexTsx = pathUtil.resolve(
              ...dataBasePath,
              node.relativePath,
              'index.tsx',
            );
            if (fs.existsSync(indexTsx)) {
              pageData.component = indexTsx;
            }
          }
          // Look for an index.json which might explicitly set the path or template.
          const indexJson = pathUtil.resolve(
            ...dataBasePath,
            node.relativePath,
            'index.json',
          );
          if (fs.existsSync(indexJson)) {
            const contents = fs.readFileSync(indexJson);
            const { '#template': component, '#path': path } = JSON.parse(
              contents,
            );
            if (component) {
              pageData.component = pathUtil.resolve(
                ...templateBasePath,
                `${component}.jsx`,
              );
            }
            if (path) pageData.path = path;
          }
          console.log('Creating page ', slug, pageData.path, pageData.component);
          createPage(pageData);
        } catch (exception) {
          console.warn(`Error trying to create ${pageData.path}`, exception);
        }
      });
      return resolve();
    });
  });
};
