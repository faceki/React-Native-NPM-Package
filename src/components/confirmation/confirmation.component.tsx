import {Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import branding from '../../branding';
import {styles} from './styles';
import {globalStyles} from '../../../globalStyles';

type props = {
  finalResult:
    | {
        icon: string;
        heading: string;
        subText: string;
        success: boolean;
      }
    | undefined;
};

/**
 * A component for displaying the final result of the user verification process.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.finalResult - An object containing the icon, heading, subtext, and success status of the final result.
 * @returns {JSX.Element} - The rendered component as a JSX element.
 */

const Confirmation = ({finalResult}: props) => {
  return (
    <View style={styles.container}>
      <AntDesign
        name={finalResult?.icon || 'exclamationcircleo'}
        size={100}
        color={
          finalResult?.success
            ? branding.colors.success
            : branding.colors.textDefault
        }
        style={styles.icon}
      />
      <Text style={[styles.heading, globalStyles.textRegular]}>
        {[finalResult?.heading]}
      </Text>
      <Text style={[styles.subHeading, globalStyles.textRegular]}>
        {[finalResult?.subText]}
      </Text>
    </View>
  );
};

export default Confirmation;
