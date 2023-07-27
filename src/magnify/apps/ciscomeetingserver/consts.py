""" cisco app consts """
import os

from django.conf import settings

ACCESS_METHODS_GUEST_KEY = "invite"
ACCESS_METHODS_ORGANIZER_KEY = "organisateur"

API_HOST = settings.CISCO_API_BASE_URL
BASE_API_URL = f"{API_HOST}/api/v1"
BASE_ROOMS_URL = settings.CISCO_ROOMS_BASE_URL
CISCO_API_USERNAME = os.environ.get("CISCO_API_USERNAME")
CISCO_API_PASSWORD = os.environ.get("CISCO_API_PASSWORD")
CALLLEGPROFILES_TEMPLATES = {
    ACCESS_METHODS_ORGANIZER_KEY: {
        "needsActivation": False,
        "name": ACCESS_METHODS_ORGANIZER_KEY,
        "participantLabels": True,
        "presentationContributionAllowed": True,
        "presentationViewingAllowed": True,
        "joinToneParticipantThreshold": 1,
        "leaveToneParticipantThreshold": 0,
        "videoMode": "auto",
        "sipMediaEncryption": "optional",
        "deactivationMode": "remainActivated",
        "muteOthersAllowed": True,
        "videoMuteOthersAllowed": True,
        "muteSelfAllowed": True,
        "videoMuteSelfAllowed": True,
        "endCallAllowed": True,
        "disconnectOthersAllowed": True,
        "telepresenceCallsAllowed": True,
        "sipPresentationChannelEnabled": True,
        "changeLayoutAllowed": True,
        "bfcpMode": "serverAndClient",
        "callLockAllowed": True,
        "setImportanceAllowed": True,
        "allowAllMuteSelfAllowed": True,
        "allowAllPresentationContributionAllowed": True,
        "recordingControlAllowed": True,
        "streamingControlAllowed": False,
        "addParticipantAllowed": True,
        "qualityMain": "unrestricted",
        "qualityPresentation": "unrestricted",
        "participantCounter": "always",
        "audioGainMode": "disabled",
        "meetingTitlePosition": "bottom",
        "maxCallDurationTime": 43200,
        "controlRemoteCameraAllowed": True,
        "chatContributionAllowed": True,
        "changeRoleAllowed": True,
    },
    ACCESS_METHODS_GUEST_KEY: {
        "needsActivation": True,
        "name": ACCESS_METHODS_GUEST_KEY,
        "participantLabels": True,
        "presentationContributionAllowed": True,
        "presentationViewingAllowed": True,
        "joinToneParticipantThreshold": 1,
        "leaveToneParticipantThreshold": 0,
        "videoMode": "auto",
        "sipMediaEncryption": "optional",
        "deactivationMode": "deactivate",
        "deactivationModeTime": 2,
        "muteOthersAllowed": True,
        "videoMuteOthersAllowed": False,
        "endCallAllowed": False,
        "disconnectOthersAllowed": False,
        "telepresenceCallsAllowed": True,
        "sipPresentationChannelEnabled": True,
        "bfcpMode": "serverAndClient",
        "callLockAllowed": False,
        "setImportanceAllowed": False,
        "allowAllMuteSelfAllowed": False,
        "allowAllPresentationContributionAllowed": False,
        "changeJoinAudioMuteOverrideAllowed": False,
        "recordingControlAllowed": False,
        "streamingControlAllowed": False,
        "qualityMain": "unrestricted",
    },
}
