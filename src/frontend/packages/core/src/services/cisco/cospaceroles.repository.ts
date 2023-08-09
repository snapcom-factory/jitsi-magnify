import { HttpService } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';
import { CospaceRolesRoutes } from '../../utils/routes/api/cisco';
import { CoSpaceUserAccesses } from '../../types/entities/cisco/room';

class CiscoCospaceRolesRepository {
  public static async create(data: Object): Promise<CoSpaceUserAccesses> {
    const response = await HttpService.MagnifyApi.post<CoSpaceUserAccesses>(CospaceRolesRoutes.CREATE, data);
    return response.data;
  }

  public static async getAll(cospaceId?: string): Promise<CoSpaceUserAccesses[] | []> {
    if (!cospaceId) {
      return [];
    }
    const response = await HttpService.MagnifyApi.get<{results: CoSpaceUserAccesses[]}>(CospaceRolesRoutes.GET_ALL, {
      params: {
        cospace_cisco_id: cospaceId,
      },
    });
    return response.data.results;
  }

  public static async update(cospaceId: string, data: Object) {
    const url = RoutesBuilderService.build(CospaceRolesRoutes.UPDATE, { id: cospaceId });
    const response = await HttpService.MagnifyApi.patch(url, data);
    return response.data;
  }

  public static async delete(roleId: string): Promise<Object> {
    const url = RoutesBuilderService.build(CospaceRolesRoutes.DELETE, { id: roleId });
    const response = await HttpService.MagnifyApi.delete<Object>(url);
    return response.data;
  }

}

export default CiscoCospaceRolesRepository;
