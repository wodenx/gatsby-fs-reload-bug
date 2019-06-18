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
