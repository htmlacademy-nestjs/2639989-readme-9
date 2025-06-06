import {Tag, Entity, StorableEntity} from '@project/core';

export class BlogTagEntity extends Entity implements StorableEntity<Tag> {
  public name: string;

  constructor(tag?: Tag) {
    super();
    this.populate(tag);
  }

  public populate(tag?: Tag) {
    if (!tag) {
      return;
    }

    this.id = tag.id ?? undefined;
    this.name = tag.name;
  }

  public toPOJO(): Tag {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
