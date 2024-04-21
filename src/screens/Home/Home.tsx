/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import {ColourPalette} from '../../../ColourPalette';
import {LOGFILE} from '../../constants/Constants';

const Home = () => {
  const [uniqueIPCount, setUniqueIPCount] = useState(0);
  const [topURLs, setTopURLs] = useState([]);
  const [topIPs, setTopIPs] = useState([]);

  const writeFile = () => {
    const path = RNFS.DocumentDirectoryPath + '/logfile.txt';
    RNFS.writeFile(path, LOGFILE, 'utf8')
      .then(() => console.log('FILE WRITTEN!'))
      .catch(err => console.log(err.message));
  };

  const readFile = async () => {
    try {
      const path = RNFS.DocumentDirectoryPath + '/logfile.txt';
      const content = await RNFS.readFile(path, 'utf8');
      const lines = content.split('\n');

      let ipCounts = {};
      let urlCounts = {};

      lines.forEach(line => {
        const [ip, url] = extractIPAndURL(line);
        if (ip) {
          ipCounts[ip] = (ipCounts[ip] || 0) + 1;
        }
        if (url) {
          urlCounts[url] = (urlCounts[url] || 0) + 1;
        }
      });

      // Count unique IP addresses
      setUniqueIPCount(Object.keys(ipCounts).length);

      // Find top 3 most visited URLs
      const topURL = Object.entries(urlCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3);
      setTopURLs(topURL);

      // Find top 3 most active IP addresses
      const topIP = Object.entries(ipCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3);
      setTopIPs(topIP);
    } catch (error) {
      console.error('Error analyzing log file:', error);
    }
  };

  const extractIPAndURL = line => {
    const match = line.match(/^(\d+\.\d+\.\d+\.\d+) .*?"(.*?)"/);
    if (match) {
      return [match[1], match[2]];
    }
    return [null, null];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => writeFile()}>
        <Text style={styles.text}>{'WRITE'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => readFile()}>
        <Text style={styles.text}>{'READ'}</Text>
      </TouchableOpacity>
      <View style={styles.details}>
        <View style={styles.count}>
          <Text style={styles.countText}>
            {'The number of unique IP addresses :'}
          </Text>
          <Text style={styles.countResult}>{uniqueIPCount}</Text>
        </View>
        <View style={styles.count}>
          <Text style={styles.countText}>{'The Top 3 Most Visited URLs:'}</Text>
          {topURLs.map(([url, count], index) => (
            <Text style={styles.countResult} key={index}>
              {url}: {count}
            </Text>
          ))}
        </View>
        <View style={styles.count}>
          <Text style={styles.countText}>
            {'Top 3 Most Active IP Addresses:'}
          </Text>
          {topIPs.map(([ip, count], index) => (
            <Text style={styles.countResult} key={index}>
              {ip}: {count}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColourPalette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: ColourPalette.lightGreen,
    margin: 10,
    padding: 10,
    borderRadius: 4,
  },
  text: {
    color: ColourPalette.black,
    fontSize: 16,
  },
  details: {
    backgroundColor: ColourPalette.white,
    marginTop: 50,
  },
  count: {
    padding: 10,
    marginTop: 20,
  },
  countText: {
    fontSize: 18,
    color: ColourPalette.darkGreen,
  },
  countResult: {
    marginTop: 20,
  },
});
