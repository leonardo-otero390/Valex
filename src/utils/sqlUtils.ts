interface IObjectToInsertQuery {
  object: any;
  offset: number;
}

export function mapObjectToUpdateQuery(object: IObjectToInsertQuery) {
  const objectColumns = Object.keys(object.object)
    .map((key, index) => `"${key}"=$${index + object.offset}`)
    .join(',');
  const objectValues = Object.values(object);

  return { objectColumns, objectValues };
}
