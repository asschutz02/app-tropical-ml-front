

export class Sorter {
  public static dynamycSort(property: string): any {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substring(1);
    }

    return function (a: any, b: any) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }

  }
}
