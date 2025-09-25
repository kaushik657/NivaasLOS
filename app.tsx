/*
 * Copyright (c) 2020-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import React, { useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { oauth, net } from "react-native-force";
import RootNavigator from "./src/navigation/RootNavigator";
import GlobalConfig from "./src/utils/Configs";
import { saveAuthToken } from "./src/services/Keychain";

function App(): JSX.Element {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  useEffect(() => {
    async function getAuthCredentials() {
      oauth.getAuthCredentials(
        async (credentials) => {
          // <-- credentials parameter here
          console.log(credentials);

          console.log("Access Token:", credentials.accessToken);
          GlobalConfig.instanceUrl = credentials.instanceUrl;
          console.log(GlobalConfig.instanceUrl);
          setAccessToken(credentials.accessToken);
          await saveAuthToken(credentials.accessToken);
          //fetchData(); // your existing logic
        },
        () => {
          oauth.authenticate(
            async (credentials) => {
              // <-- credentials parameter here too
              console.log("Access Token:", credentials.accessToken);
              console.log("instance url:", credentials.instanceUrl);
              GlobalConfig.instanceUrl = credentials.instanceUrl;
              setAccessToken(credentials.accessToken);
              await saveAuthToken(credentials.accessToken);
              //  that.fetchData();
            },
            (error) => console.log("Failed to authenticate: " + error)
          );
        }
      );
    }
    getAuthCredentials();
  }, []);

  return <>{accessToken && <RootNavigator />}</>;
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "white",
    alignItems: "center",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default App;
