import {Image, Text, View} from 'react-native';
import React from 'react';
import {styles} from './styles';

const IDCARD = '../../assets/id1.png';
const SELFIE = '../../assets/selfie.png';
const IDCARDBACK = '../../assets/id_card_back.png';
import {CheckBox} from '@rneui/themed';
import branding from '../../branding';
import {globalStyles} from '../../../globalStyles';

/**
 * A component for displaying the required documents for the KYC process and allowing the user to confirm their consent to the terms of use.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isChecked - A boolean indicating whether the user has confirmed their consent.
 * @param {Function} props.handleCheckbox - A function that handles changes to the consent checkbox.
 * @param {string} props.selectedOption - The selected KYC document type.
 * @returns {JSX.Element} - The rendered component as a JSX element.
 */

type RequirementsDocumentsProps = {
  isChecked: boolean;
  handleCheckbox: () => void;
  selectedOption: string;
};

const RequirementsDocuments = ({
  isChecked,
  handleCheckbox,
  selectedOption,
}: RequirementsDocumentsProps) => {
  return (
    <>
      <View style={styles.mainContainer}>
        <View>
          <View style={styles.topMargin}>
            <Text style={styles.bullet}>1</Text>
            <View style={styles.lign} />
          </View>

          <View>
            <Text style={styles.bullet}>2</Text>
            {selectedOption !== 'Passport' && <View style={styles.lign} />}
          </View>
          {selectedOption !== 'Passport' && (
            <View>
              <Text style={styles.bullet}>3</Text>
            </View>
          )}
        </View>
        <View style={styles.container}>
          <View style={styles.box}>
            <Image style={styles.tinyLogo} source={require(IDCARD)} />
            <Text style={[styles.boxTextLight, globalStyles.textRegular]}>
              Picture of your{' '}
              <Text style={[styles.boxText, globalStyles.textRegular]}>
                {selectedOption}
              </Text>{' '}
              - Front
            </Text>
          </View>
          {selectedOption !== 'Passport' && (
            <View style={styles.box}>
              <Image style={styles.tinyLogo} source={require(IDCARDBACK)} />
              <Text style={[styles.boxTextLight, globalStyles.textRegular]}>
                Picture of your{' '}
                <Text style={[styles.boxText, globalStyles.textRegular]}>
                  {selectedOption}
                </Text>{' '}
                - Back
              </Text>
            </View>
          )}

          <View style={styles.box}>
            <Image style={styles.tinyLogo} source={require(SELFIE)} />
            <Text style={[styles.boxTextLight, globalStyles.textRegular]}>
              Take a selfie picture
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={[styles.note, globalStyles.textBold]}>
          Consents{' '}
          <Text style={[styles.black, globalStyles.textRegular]}>&</Text> Terms
          of use
        </Text>
        <View style={styles.row}>
          <CheckBox
            center
            checked={isChecked}
            onPress={handleCheckbox}
            wrapperStyle={styles.checkbox}
            size={24}
            containerStyle={styles.transparent}
            checkedColor={branding.colors.primary}
          />
          <Text style={styles.subHeading}>
            I confirm I have read, understood and agree to continue.
          </Text>
        </View>
      </View>
    </>
  );
};

export default RequirementsDocuments;
