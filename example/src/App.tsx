import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import PagingListView from "../../src/PagingListView";

export default function App() {
  return (
    <View style={styles.container}>
      <PagingListView data={[
        {
          name: 'test',
        },
        {
          name: 'test',
        },
        {
          name: 'test',
        },
        {
          name: 'test',
        },
        {
          name: 'test',
        },
        {
          name: 'test',
        },
        {
          name: 'test',
        },
      ]} numColumns={2}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
