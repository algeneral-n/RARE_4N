/**
 * RARE 4N - Tab List Component
 * قائمة بالتبويبات
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from '../Icon';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabListProps {
  tabs: Tab[];
  items: Array<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    tabId: string;
    onPress: () => void;
  }>;
}

export default function TabList({ tabs, items }: TabListProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const filteredItems = items.filter((item) => item.tabId === activeTab);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#00EAFF' : '#888888'}
              />
            )}
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.itemsContainer}>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={item.onPress}
          >
            {item.icon && (
              <Icon
                name={item.icon}
                size={24}
                color={item.color || '#00EAFF'}
              />
            )}
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 234, 255, 0.2)',
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00EAFF',
  },
  tabLabel: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#00EAFF',
    fontWeight: '600',
  },
  itemsContainer: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    gap: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

 * RARE 4N - Tab List Component
 * قائمة بالتبويبات
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from '../Icon';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabListProps {
  tabs: Tab[];
  items: Array<{
    id: string;
    title: string;
    icon?: string;
    color?: string;
    tabId: string;
    onPress: () => void;
  }>;
}

export default function TabList({ tabs, items }: TabListProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const filteredItems = items.filter((item) => item.tabId === activeTab);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? '#00EAFF' : '#888888'}
              />
            )}
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.itemsContainer}>
        {filteredItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={item.onPress}
          >
            {item.icon && (
              <Icon
                name={item.icon}
                size={24}
                color={item.color || '#00EAFF'}
              />
            )}
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 234, 255, 0.2)',
  },
  tabContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00EAFF',
  },
  tabLabel: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#00EAFF',
    fontWeight: '600',
  },
  itemsContainer: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 234, 255, 0.1)',
    gap: 12,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});


