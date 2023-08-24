import { RoomUser } from "../../room";

export interface CoSpaceInterface {
    name: string;
    cisco_id: string;
    call_id: string;
    secret: string;
    owner_call_id?: string;
    is_owner_ask_for_secret?: boolean;
    owner_secret?: string;
    guest_call_id?: string;
    is_guest_ask_for_secret?: boolean;
    guest_secret?: string;
    owner_jid?: string;
    owner_url?: string;
    guest_url?: string;
    sip_url: string;
    role?: string;
  }
  
  export interface CoSpaceUserAccesses {
    id: string;
    role: RoomAccessRole;
    cospace_cisco_id: string;
    user: RoomUser;
  }
  export interface PostCoSpaceUserAccesses {
    id: string;
    role: RoomAccessRole;
    cospace_cisco_id: string;
    user: string;
  }
  
  export enum RoomAccessRole {
    OWNER = 'owner',
    ADMINISTRATOR = 'administrator',
    MEMBER = 'member',
  }
  