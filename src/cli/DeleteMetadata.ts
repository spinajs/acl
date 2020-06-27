import { Cli, ICliCommand } from '@spinajs/cli';
import { Logger, Log } from '../../../log/lib';
import { User } from '../models/User';

@Cli('acl:delete-metadata <login> <key>', 'Delete metadata from user user')
export class DeleteMetadata implements ICliCommand {
  @Logger()
  protected Log: Log;

  public get Name(): string {
    return 'Add user metadata';
  }

  public async execute(login: string, key: string) {
    try {
      const user = await User.where({
        Email: login,
      })
        .populate('Metadata', function() {
          this.where({
            Key: key,
          });
        })
        .first<User>();

      if (!user) {
        this.Log.error(`User ${login} not exists in database`);
        return -1;
      }

      if (user.Metadata.length === 0) {
        this.Log.info('Nothing to delete');
        return 0;
      }

      // when owner & key already exists update its content
      await user.Metadata.remove(user.Metadata[0]);

      this.Log.info('Metadata deleted');

      return 0;
    } catch (ex) {
      this.Log.error(ex, 'Cannot delete metadata to user');
      return -1;
    }
  }
}
