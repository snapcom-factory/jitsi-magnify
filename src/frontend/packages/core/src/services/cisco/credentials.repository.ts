import { AxiosResponse } from 'axios';
import { RoomResponse } from '../../types/api/room';
import { CredentialApiRoutes } from '../../utils/routes/api/cisco';
import { HttpService } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';

export class CiscoApiCredentialRepository {
  public static async get(): Promise<Object | null> {
    const url = RoutesBuilderService.build(CredentialApiRoutes.GET);
    let response: AxiosResponse<RoomResponse>;

    response = await HttpService.MagnifyApi.get(url);

    return response.data;
  }

  public static async update(data: Object) {
    const url = RoutesBuilderService.build(CredentialApiRoutes.UPDATE);
    const response = await HttpService.MagnifyApi.post(url, data);
    return response.data;
  }
}

export default CiscoApiCredentialRepository;
