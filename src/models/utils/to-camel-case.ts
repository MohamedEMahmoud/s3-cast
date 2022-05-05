import { UserAttrs } from '../user.model';

export const toCamelCase = (rows: UserAttrs[]) => {
  return rows.map((row: { [key: string]: string }) => {
    const replaced: { [key: string]: string } = {};

    for (const key in row) {
      const camelCase = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('_', '')
      );

      replaced[camelCase] = row[key];
    }

    return replaced;
  });
};
