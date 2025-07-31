import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import branch, { BranchParams } from 'react-native-branch';

// Dummy placeholders – replace with actual values
const username = 'john123';
const referralUserName = 'johnDoe';
const platform = 'android'; // or 'ios'
const sourceType = 'app';
const controlParams = {};
const BRANCH_SHARE_CONTENT = 'Invite your friends and earn rewards!';
const defaultUrlOnBranchError = 'https://cashkaro.com/app-referral';

const App = () => {

  useEffect(() => {
    generateReferralLink();
  }, []);

  const generateReferralLink = async () => {
    try {
      const branchUniversalObject = await branch.createBranchUniversalObject('referAndEarn', {
        locallyIndex: true,
        title: 'CashKaro App Referral',
        contentDescription: BRANCH_SHARE_CONTENT,
        contentMetadata: {
          customMetadata: {
            r: String(username),
            refName: encodeURI(referralUserName),
            source: platform,
          },
        },
      });

      const linkProperties = {
        feature: 'referral',
        channel: sourceType,
        campaign: 'appReferral',
      };

      const urlObj = await branchUniversalObject.generateShortUrl(linkProperties, controlParams);

      if (urlObj?.url === '') {
        // Retry or fallback
        try {
          const retryUrlObj = await branchUniversalObject.generateShortUrl(linkProperties, controlParams);
          // Share this retryUrlObj.url
          console.log('Retry URL:', retryUrlObj.url);
        } catch (retryErr) {
          console.error('Branch Retry Error:', retryErr);
          // Fallback to default
          setReferralLink({ link: defaultUrlOnBranchError, status: false });
        }
      } else {
        // Success
        console.log('Generated Referral URL:', urlObj.url);
        setReferralLink({ link: urlObj.url, status: true });
      }

    } catch (err) {
      console.error('Branch Generation Error:', err);
      setReferralLink({ link: defaultUrlOnBranchError, status: false });
    }
  };

  // Dummy setReferralLink (replace with state/store logic)
  const setReferralLink = ({ link, status }: { link: string; status: boolean }) => {
    console.log('Referral Link Set:', link, 'Status:', status);
  };

  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;