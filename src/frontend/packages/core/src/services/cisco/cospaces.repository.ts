import { AxiosResponse } from 'axios';
import { RoomResponse } from '../../types/api/room';
import { CoSpaceApiRoutes } from '../../utils/routes/api/cisco';
import { HttpService } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';

export class CiscoCoSpaceRepository {
  public static async getAll(): Promise<any | null> {
    const url = RoutesBuilderService.build(CoSpaceApiRoutes.GET_ALL);
    let response: AxiosResponse<RoomResponse>;

    response = await HttpService.MagnifyApi.get(url);

    return response.data;
  }

  public static async get(id: string): Promise<any | null> {
    const url = RoutesBuilderService.build(CoSpaceApiRoutes.GET, {id: id});
    let response: AxiosResponse<RoomResponse>;

    response = await HttpService.MagnifyApi.get(url);

    return response.data;
  }

}

export default CiscoCoSpaceRepository;
