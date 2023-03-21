import React, {useEffect, useRef, useState} from 'react';
import type {ViewStyle} from 'react-native';
import type {ImageStyle} from 'react-native';
import type {ListRenderItemInfo} from 'react-native';
import type {ListRenderItem} from 'react-native';
import type {TextStyle} from 'react-native';
import type {StyleProp} from 'react-native';
import {Text} from 'react-native';
import {
  StyleSheet,
  View,
  Animated,
  Image,
  useWindowDimensions,
  FlatList,
  Dimensions,
} from 'react-native';

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

type CategoryComponentType = {
  data?: any;
  numColumns?: number;
  scrollContainer?: StyleProp<ViewStyle> | undefined;
  renderChildItem?: ListRenderItem<ItemType> | null | undefined;
  contentWidth?: number;
  textItemStyle?: StyleProp<TextStyle> | undefined;
  imageItemStyle?: StyleProp<ImageStyle> | undefined;
  indicatorColorActive?: string;
  indicatorColorInActive?: string;
};
type ItemType = {
  name?: string;
  image_url?: any
};
export default function PagingListView({
                                         data,
                                         numColumns = 4,
                                         scrollContainer,
                                         renderChildItem,
                                         contentWidth,
                                         textItemStyle,
                                         imageItemStyle,
                                         indicatorColorActive = 'red',
                                         indicatorColorInActive = 'gray',
                                       }: CategoryComponentType) {
  const scrollX = useRef(new Animated.Value(0)).current;
  let {width: windowWidth} = useWindowDimensions();
  const [customData, setCustomData] = useState<any>([]);
  if (contentWidth) {
    _contentWidth = contentWidth;
  }
  useEffect(() => {
    getViewCategory(data);
  }, [data]);
  const getViewCategory = (data: []) => {
    let list = [];
    for (let i = 0; i < data.length; i += numColumns * 2) {
      let newData = data.slice(i, i + numColumns * 2);
      list.push(newData);
    }
    setCustomData(list);
  };

  const _renderChildItem = ({
                              item,
                              index,
                              separators,
                            }: ListRenderItemInfo<ItemType>) => {
    if (renderChildItem != undefined) {
      return renderChildItem({item, index, separators});
    }
    return (
      <View
        key={`${index}`}
        style={{
          margin: 4,
          width:
            (contentWidth ?? _contentWidth - _paddingViewContent * 2) /
            numColumns -
            numColumns / 2,
          marginBottom: 6,
        }}
      >
        <Image
          source={item?.image_url ?? require('../example/assets/icon.png')}
          style={[styles.imageStyle, imageItemStyle]}
        />
        <Text style={[styles.textItemStyle, textItemStyle]} numberOfLines={2}>
          {item?.name}
        </Text>
      </View>
    );
  };
  return (
    <View
      style={[
        styles.scrollContainer,
        {
          width: _contentWidth - _paddingViewContent,
        },
        scrollContainer,
      ]}
    >
      <FlatList
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        data={customData}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                x: scrollX,
              },
            },
          },
        ])}
        scrollEventThrottle={1}
        renderItem={({item: parent, index}) => {
          return (
            <View
              style={{
                width: contentWidth ?? _contentWidth - _paddingViewContent,
                marginTop: 10,
              }}
              key={`${index}`}
            >
              <FlatList
                {...{
                  numColumns: numColumns,
                }}
                key={`${numColumns}`}
                data={parent}
                keyExtractor={(index) => index.toString()}
                renderItem={_renderChildItem}
              />
            </View>
          );
        }}
      />
      <View style={styles.indicatorContainer}>
        {customData.map((_: any, imageIndex: number) => {
          // if(contentWidth){
          //   windowWidth=contentWidth
          // }
          const width = scrollX.interpolate({
            inputRange: [
              windowWidth * (imageIndex - 1),
              windowWidth * imageIndex,
              windowWidth * (imageIndex + 1),
            ],
            outputRange: [16, 16, 16],
            extrapolate: 'clamp',
          });
          const backgroundColor = scrollX.interpolate({
            inputRange: [
              windowWidth * (imageIndex - 0.5),
              windowWidth * imageIndex,
              windowWidth * (imageIndex + 0.5),
            ],
            outputRange: [
              indicatorColorInActive,
              indicatorColorActive,
              indicatorColorInActive,
            ],
          });
          return (
            <Animated.View
              key={imageIndex}
              style={[styles.normalDot, {width, backgroundColor}]}
            />
          );
        })}
      </View>
    </View>
  );
}
let {width} = Dimensions.get('window');
let _contentWidth = width;
let _paddingViewContent = 32;
const styles = StyleSheet.create({
  textItemStyle: {
    textAlign: 'center',
    marginTop: 4,
  },
  imageStyle: {
    height: undefined,
    width: '100%',
    aspectRatio: 1,
  },
  container: {
    width: _contentWidth,
    alignSelf: 'center',
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  normalDot: {
    height: 2,
    width: 24,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
