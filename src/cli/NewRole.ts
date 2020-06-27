import { Cli, ICliCommand, Option } from '@spinajs/cli';
import { Logger, Log } from '../../../log/lib';
import { InsertBehaviour, Orm } from '@spinajs/orm';
import { Autoinject } from '@spinajs/di';
import { Role } from '../models/Role';

@Cli('acl:new-role <slug> <name>', 'Adds new role to system')
@Option('-p, --parent <parent>', 'Parent role to inherit permissions')
@Option('-d, --description <description>', 'Resource description')
export class NewResource implements ICliCommand {
  @Logger()
  protected Log: Log;

  @Autoinject()
  protected Orm: Orm;

  public get Name(): string {
    return 'Add new role to ACL';
  }

  public async execute(Slug: string, Name: string, command: any) {
    try {
      const role = new Role({
        Slug,
        Name,
        Description: command.description?.trim(),
      });

      if (command.parent) {
        const parent = await Role.where('slug', command.parent).firstOrFail<Role>();
        role.parent_id = parent.Id;
      }

      await role.save(InsertBehaviour.OnDuplicateIgnore);

      this.Log.info(`role ${Slug} added`);

      return 0;
    } catch (ex) {
      this.Log.error(ex, 'Cannot add role');
      return -1;
    }
  }
}
