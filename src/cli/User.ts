import { Cli, ICliCommand } from '@spinajs/cli';
import { Logger, Log } from '../../../log/lib';
import { User as UserModel } from '../models/User';
import { Autoinject } from '@spinajs/di';
import { Orm } from '@spinajs/orm';

@Cli('acl:user <login>', 'Get info about specified user and attached roles')
export class User implements ICliCommand {
  @Logger()
  protected Log: Log;

  public get Name(): string {
    return 'User info';
  }

  @Autoinject(Orm)
  protected Orm: Orm;

  public async execute(login: string) {
    try {
      const user = await UserModel.where({
        Email: login,
      })
        .populate('Roles')
        .populate('Metadata')
        .first<UserModel>();

      if (!user) {
        this.Log.info(`User ${login} not exists in db`);
        return 0;
      }

      this.Log.info(`User: ${user.Id}:${user.Email}, name: ${user.NiceName}, created at: ${user.CreatedAt}`);
      this.Log.info(`Roles: ${user.Roles.map(r => r.Slug).join(',')}`);
      this.Log.info(`Metadata`);

      user.Metadata.forEach(m => {
        this.Log.info(`Key: ${m.Key}=${m.Value}`);
      });

      return 0;
    } catch (ex) {
      this.Log.error(ex, 'Cannot load user from db');
      return -1;
    }
  }
}
