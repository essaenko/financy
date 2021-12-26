export interface TreeNode {
  id: number | undefined;
  parent?: {
    id: number | undefined;
  }
  children?: Record<string, any>;
}

export const normalizeTree = <T extends {
  id: number | undefined;
  parent?: {
    id: number | undefined;
  }
}>(
  collection: T[]
): Record<string, T & TreeNode> => {
  const result: Record<string, T & TreeNode> = {};

  const putChildrenToPlaces = (parent: T & TreeNode) => {
    collection.filter((node) => node.parent?.id === parent.id).forEach((node) => {
      if (parent.children === void 0) parent.children = {};
      parent.children[node.id as number] = {...node};

      putChildrenToPlaces(parent.children[node.id as number]);
    });
  }

  collection.filter((node) => node.parent === null).forEach((node) => {
    result[node.id as number] = {...node};

    putChildrenToPlaces(result[node.id as number]);
  });

  return result;
}
