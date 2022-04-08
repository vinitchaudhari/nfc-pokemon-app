import { Platform, Alert } from 'react-native';
import NfcManager, {
    NfcTech,
    Ndef,
    NfcEvents,
    NfcError,
} from 'react-native-nfc-manager';

class ErrSuccess extends Error { }

const handleException = ex => {
    if (ex instanceof NfcError.UserCancel) {
        // bypass
    } else if (ex instanceof NfcError.Timeout) {
        Alert.alert('NFC Session Timeout');
    } else {
        console.warn(ex);

        if (Platform.OS === 'ios') {
            NfcManager.invalidateSessionWithErrorIOS(`${ex}`);
        } else {
            Alert.alert('NFC Error', `${ex}`);
        }
    }
};

class NfcProxy {
    async init() {
        const supported = await NfcManager.isSupported();
        if (supported) {
            await NfcManager.start();
        }
        return supported;
    }

    async isEnabled() {
        return NfcManager.isEnabled();
    }

    async goToNfcSetting() {
        return NfcManager.goToNfcSetting();
    }

    readTag = async () => {
        let tag = null;

        try {
            await NfcManager.requestTechnology([NfcTech.Ndef]);

            tag = await NfcManager.getTag();
            tag.ndefStatus = await NfcManager.ndefHandler.getNdefStatus();

            // if (Platform.OS === 'ios') {
            //   await NfcManager.setAlertMessageIOS('Success');
            // }
        } catch (ex) {
            // for tag reading, we don't actually need to show any error
            console.log('NFC', ex);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }

        return tag;
    };

    writeNdef = async ({ type, value }) => {
        let result = false;

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef, {
                alertMessage: 'Ready to write some NDEF',
            });

            let bytes = null;
            if (type === 'TEXT') {
                bytes = Ndef.encodeMessage([Ndef.textRecord(value)]);
            } else if (type === 'URI') {
                bytes = Ndef.encodeMessage([Ndef.uriRecord(value)]);
            } else if (type === 'WIFI_SIMPLE') {
                bytes = Ndef.encodeMessage([Ndef.wifiSimpleRecord(value)]);
            } else if (type === 'VCARD') {
                const { name, tel, org, email } = value;
                const vCard = `BEGIN:VCARD\nVERSION:2.1\nN:;${name}\nORG: ${org}\nTEL;HOME:${tel}\nEMAIL:${email}\nEND:VCARD`;

                bytes = Ndef.encodeMessage([
                    Ndef.record(Ndef.TNF_MIME_MEDIA, 'text/vcard', [], vCard),
                ]);
            }

            if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes);

                if (Platform.OS === 'ios') {
                    await NfcManager.setAlertMessageIOS('Success');
                }

                result = true;
            }
        } catch (ex) {
            handleException(ex);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }

        return result;
    };
}

export default new NfcProxy();
export { ErrSuccess };
