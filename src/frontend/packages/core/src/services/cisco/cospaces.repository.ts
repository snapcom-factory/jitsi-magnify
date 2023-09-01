import { AxiosResponse } from 'axios';
import { RoomResponse } from '../../types/api/room';
import { CoSpaceApiRoutes } from '../../utils/routes/api/cisco';
import { HttpService } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';
import { CoSpaceInterface } from '../../types/entities/cisco/room';

export class CiscoCoSpaceRepository {
  public static async getAll(): Promise<any | null> {
    const sample = JSON.parse(`
    [
      {
          "name": "Conférence 1211",
          "cisco_id": "2c1f2560-9d53-4c24-acc1-8e8ce4e6b5ed",
          "call_id": "18001",
          "secret": "8u44cwMPb1E28S0nfTz2xw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Georgy Grigoryev",
          "cisco_id": "977cb353-5abe-457a-a6e8-3e3aaba99754",
          "call_id": "383897181",
          "secret": "nq.p910YFrXi.s0PwqwqWQ",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": "ggrigoryev@my-domain.com",
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Interview with John",
          "cisco_id": "c4cd11ca-eb7f-46f1-a914-9a92051d1c44",
          "call_id": "306385411",
          "secret": "riwC0iUYO_AIYZkCOjADZA",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Interview with John 02",
          "cisco_id": "dcf581fa-1e7a-4c4c-adb3-28dfdf4cf70e",
          "call_id": "016670561",
          "secret": "a3AiJXTzPd7rhhreRCrAhw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Joseph Bedminster",
          "cisco_id": "4a4349d8-73b6-410c-a4c4-0c1a09c0b1e2",
          "call_id": "379538646",
          "secret": "umhnM7n2PBL.dTOwMTz4XA",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": "joseph.bedminster@my-domain.com",
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Salle RTMP",
          "cisco_id": "9e604194-c2de-4cef-8a3a-7cac982574a7",
          "call_id": "18004",
          "secret": "PiUGlQ6qciZh5RJodgl66g",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Second test from django",
          "cisco_id": "6c8aa051-584f-40a9-bfbc-1ff59898a607",
          "call_id": "683088912",
          "secret": "1x53zBBdwvvNAwou0esO1A",
          "owner_call_id": "68308891200",
          "is_owner_ask_for_secret": true,
          "owner_secret": "7OnTXkR1XH3iAWWOIt_8SA",
          "guest_call_id": "68308891201",
          "is_guest_ask_for_secret": true,
          "guest_secret": "M5GGrBjDK3MV5a_d0s0uMA",
          "owner_jid": "jobe@snapcom.fr",
          "owner_url": "https://cms.visio.snapcom.eu/meeting/68308891200?secret=7OnTXkR1XH3iAWWOIt_8SA",
          "guest_url": "https://cms.visio.snapcom.eu/meeting/68308891201?secret=M5GGrBjDK3MV5a_d0s0uMA"
      },
      {
          "name": "Test from django",
          "cisco_id": "57a0f302-e831-473d-9959-b1ffd284c345",
          "call_id": "037552911",
          "secret": "txUJxqKjwtAlESWAF41TMA",
          "owner_call_id": "03755291100",
          "is_owner_ask_for_secret": true,
          "owner_secret": "oJGDg9IdB4LE6BNKwtor6g",
          "guest_call_id": "03755291101",
          "is_guest_ask_for_secret": true,
          "guest_secret": "1SP2iAfm8Ie2fQ7.oHuFxQ",
          "owner_jid": "jobe@snapcom.fr",
          "owner_url": "https://cms.visio.snapcom.eu/meeting/03755291100?secret=oJGDg9IdB4LE6BNKwtor6g",
          "guest_url": "https://cms.visio.snapcom.eu/meeting/03755291101?secret=1SP2iAfm8Ie2fQ7.oHuFxQ"
      },
      {
          "name": "Test vmr creation Through userpmp license",
          "cisco_id": "bdb54fcf-2e09-40d8-911c-d838e27afd14",
          "call_id": "",
          "secret": null,
          "owner_call_id": "987654321",
          "is_owner_ask_for_secret": true,
          "owner_secret": "cvSrcP7LLHqpzcCJBipOBg",
          "guest_call_id": "123456789",
          "is_guest_ask_for_secret": true,
          "guest_secret": "wCfj6448snmS811Sv3.vhA",
          "owner_jid": "userpmp@my-domain.com",
          "owner_url": "https://cms.visio.snapcom.eu/meeting/987654321?secret=cvSrcP7LLHqpzcCJBipOBg",
          "guest_url": "https://cms.visio.snapcom.eu/meeting/123456789?secret=wCfj6448snmS811Sv3.vhA"
      },
      {
          "name": "Test1",
          "cisco_id": "30faf287-50e4-470a-96e1-c2cf3912acc0",
          "call_id": "9971234",
          "secret": "T4tJqXcBxrp8vlLLZFpInw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Test2",
          "cisco_id": "36e74ba3-c03d-48ad-97ea-56ffe4386eaf",
          "call_id": "2010112345",
          "secret": "k5jYo5OQsH2MCNlamAKsFA",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Test3",
          "cisco_id": "3e0627c5-7a64-48fd-8714-d794d61a67ab",
          "call_id": "2000212345",
          "secret": "pBNIV26UGIYxW9fDtxXQ0g",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Test4",
          "cisco_id": "81d29568-06cf-4d7c-921a-270189e5b375",
          "call_id": "0312345",
          "secret": "Iuj_8WsD_DsUZMIP8VL53w",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "Testdoublepwd",
          "cisco_id": "4f79b68e-5a95-4ae9-85ef-9112be20cee1",
          "call_id": "",
          "secret": null,
          "owner_call_id": "18006",
          "is_owner_ask_for_secret": true,
          "owner_secret": "E9pqu6cbKZ65aQKre095rA",
          "guest_call_id": "18006",
          "is_guest_ask_for_secret": true,
          "guest_secret": "xykiVLlPU6YOsAjL2xNvYw",
          "owner_jid": null,
          "owner_url": "https://cms.visio.snapcom.eu/meeting/18006?secret=E9pqu6cbKZ65aQKre095rA",
          "guest_url": "https://cms.visio.snapcom.eu/meeting/18006?secret=xykiVLlPU6YOsAjL2xNvYw"
      },
      {
          "name": "nca test record auto",
          "cisco_id": "f5cba5e0-3ad6-4ba4-8987-d608b4900c83",
          "call_id": "18002",
          "secret": "S4mnTrZ1IQYvucGkhUevNw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "nca test record manual",
          "cisco_id": "ba954165-34e3-4363-a89e-01cdc4d6e50a",
          "call_id": "18003",
          "secret": "9dGJJjQ0jyDmzPBxEHuJ8A",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "sdq qsd",
          "cisco_id": "9bdede5c-5873-47c9-9911-b5d8c642c12c",
          "call_id": "304081818",
          "secret": "sDXVJUGT3y9Ez1CpCC1_Fw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": "test@my-domain.com",
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "test",
          "cisco_id": "a0fcb7a6-a7b1-443e-a7aa-fcc60a7a0178",
          "call_id": "18000",
          "secret": "MaApkbSBrSuVJbJLKvfzOw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "testCospace",
          "cisco_id": "51b4efbd-5356-49ce-ad8e-58958366479f",
          "call_id": "8999",
          "secret": "wGLzbtlEv6v.wW6MdBqzjw",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": null,
          "owner_url": null,
          "guest_url": null
      },
      {
          "name": "userpmp userpmp",
          "cisco_id": "7bc38dc8-9928-4957-a9d4-86fe243feb33",
          "call_id": "617542519",
          "secret": "kynAifOFMPhKwGV9GZfTbg",
          "owner_call_id": null,
          "is_owner_ask_for_secret": false,
          "owner_secret": null,
          "guest_call_id": null,
          "is_guest_ask_for_secret": false,
          "guest_secret": null,
          "owner_jid": "userpmp@my-domain.com",
          "owner_url": null,
          "guest_url": null
      }
  ]    
    `)
    // return Promise.resolve(sample);

    const url = RoutesBuilderService.build(CoSpaceApiRoutes.GET_ALL);
    let response: AxiosResponse<RoomResponse>;

    response = await HttpService.MagnifyApi.get(url);

    return response.data;
  }

  public static async get(id: string): Promise<any | null> {
    const sample = JSON.parse(`
      {
          "name": "Second test from django",
          "cisco_id": "6c8aa051-584f-40a9-bfbc-1ff59898a607",
          "call_id": "683088912",
          "secret": "1x53zBBdwvvNAwou0esO1A",
          "owner_call_id": "68308891200",
          "is_owner_ask_for_secret": true,
          "owner_secret": "7OnTXkR1XH3iAWWOIt_8SA",
          "guest_call_id": "68308891201",
          "is_guest_ask_for_secret": true,
          "guest_secret": "M5GGrBjDK3MV5a_d0s0uMA",
          "owner_jid": "jobe@snapcom.fr",
          "owner_url": "https://cms.visio.snapcom.eu/meeting/68308891200?secret=7OnTXkR1XH3iAWWOIt_8SA",
          "guest_url": "https://cms.visio.snapcom.eu/meeting/68308891201?secret=M5GGrBjDK3MV5a_d0s0uMA"
      }
    `)
    // return Promise.resolve(sample);

    const url = RoutesBuilderService.build(CoSpaceApiRoutes.GET, {id: id});
    let response: AxiosResponse<RoomResponse>;

    response = await HttpService.MagnifyApi.get(url);

    return response.data;
  }

  public static async create(data: {name: string}): Promise<CoSpaceInterface> {
    const response = await HttpService.MagnifyApi.post<CoSpaceInterface>(CoSpaceApiRoutes.CREATE, data);
    return response.data;
  }

  public static async updateSecrets(data: {cospaceId: string, owner_secret: string, guest_secret: string}): Promise<Object> {
    const url = RoutesBuilderService.build(CoSpaceApiRoutes.UPDATE_SECRET, { id: data.cospaceId });
    const response = await HttpService.MagnifyApi.put(url, data);
    return response.data;
  }

  public static async delete(roomId?: string): Promise<any | null> {    
    if (!roomId) {
      console.error('RoomsRepository - delete, roomId is null');
      return null;
    }
    const url = RoutesBuilderService.build(CoSpaceApiRoutes.DELETE, { id: roomId });
    const response = await HttpService.MagnifyApi.delete<any>(url);
    return response.data;
  }

}

export default CiscoCoSpaceRepository;
