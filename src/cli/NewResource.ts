import { Resource } from './../models/Resource';
import { Cli, ICliCommand, Option } from '@spinajs/cli';
import { Logger, Log } from '../../../log/lib';
import { InsertBehaviour, Orm } from '@spinajs/orm';
import { Autoinject } from '@spinajs/di';

@Cli('acl:new-resource <slug> <name>', 'Adds new resource to system')
@Option('-d, --description <description>', 'Resource description')
export class NewResource implements ICliCommand {
  @Logger()
  protected Log: Log;

  @Autoinject()
  protected Orm: Orm;

  public get Name(): string {
    return 'Add new resouce to ACL';
  }

  public async execute(Slug: string, Name: string, command: any) {
    try {
      const resource = new Resource({
        Slug,
        Name,
        Description: command.description?.trim(),
      });

      await resource.save(InsertBehaviour.OnDuplicateIgnore);

      this.Log.info(`resource ${Slug} added`);

      return 0;
    } catch (ex) {
      this.Log.error(ex, 'Cannot add resource');
      return -1;
    }
  }
}
