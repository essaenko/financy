export type TreeNode<T> = T & {
  id: number | undefined;
  parent?: {
    id: number | undefined;
  };
  children?: Record<string, TreeNode<T>>;
};

export const normalizeTree = <
  T extends {
    id: number | undefined;
    parent?: {
      id: number | undefined;
    };
  },
>(
  collection: T[],
): Record<string, TreeNode<T>> => {
  const result: Record<string, TreeNode<T>> = {};

  const putChildrenToPlaces = (parent: TreeNode<T>) => {
    collection
      .filter(node => node.parent?.id === parent.id)
      .forEach(node => {
        if (parent.children === void 0) parent.children = {};
        parent.children[node.id as number] = { ...node };

        putChildrenToPlaces(parent.children[node.id as number]);
      });
  };

  collection
    .filter(node => node.parent === null)
    .forEach(node => {
      result[node.id as number] = { ...node };

      putChildrenToPlaces(result[node.id as number]);
    });

  return result;
};
