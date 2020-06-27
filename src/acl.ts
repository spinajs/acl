import { AsyncModule, Autoinject, IContainer } from '@spinajs/di';
import { Configuration } from '@spinajs/configuration';
import { PasswordProvider, AuthProvider, SessionProvider } from './interfaces';
import { BasicPasswordProvider } from './passwordProvider';
import { SimpleDbAuthProvider } from './authProvider';
import { MemorySessionProvider } from './sessionProvider';
import _ = require('lodash');
import { Role } from './models/Role';
import { Resource } from './models/Resource';
import { RoleToResource } from './models/RoleToResource';
import { InsertBehaviour } from '@spinajs/orm';

export class Acl extends AsyncModule {
  @Autoinject()
  protected Configuration: Configuration;

  protected Container: IContainer;

  public async resolveAsync(container: IContainer): Promise<void> {
    this.Container = container;

    await this._syncAclFromConfig();
    this._registerDIDefaults();
  }

  protected async _syncAclFromConfig() {
    const cfgRoles = this.Configuration.get<any[]>('acl.roles');

    for (const r of cfgRoles) {
      const roleEntity = new Role(_.omit(r, ['Resources']));
      await roleEntity.save(InsertBehaviour.OnDuplicateIgnore);

      for (const res of r.Resources) {
        const resEntity = new Resource(res);
        await resEntity.save(InsertBehaviour.OnDuplicateIgnore);

        const roleToResource = new RoleToResource({
          role_id: roleEntity.Id,
          resource_id: resEntity.Id,
          Permissions: res.Permissions,
        });

        await roleToResource.save(InsertBehaviour.OnDuplicateIgnore);
      }
    }
  }

  protected _registerDIDefaults() {
    this.Container.register(BasicPasswordProvider).as(PasswordProvider);
    this.Container.register(SimpleDbAuthProvider).as(AuthProvider);
    this.Container.register(MemorySessionProvider).as(SessionProvider);
  }
}
