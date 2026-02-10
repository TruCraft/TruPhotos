import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, spacing, typography } from '../theme';
import { RootStackParamList } from '../types';

type MarkdownScreenRouteProp = RouteProp<RootStackParamList, 'Markdown'>;

export const MarkdownScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<MarkdownScreenRouteProp>();
  const { title, content } = route.params;

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Markdown style={markdownStyles}>
          {content}
        </Markdown>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: colors.textSecondary,
  },
  heading1: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  heading2: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  heading3: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  strong: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  em: {
    fontStyle: 'italic',
  },
  bullet_list: {
    marginBottom: spacing.sm,
  },
  ordered_list: {
    marginBottom: spacing.sm,
  },
  list_item: {
    marginBottom: spacing.xs,
    flexDirection: 'row',
  },
  bullet_list_icon: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.md,
    marginRight: spacing.xs,
  },
  bullet_list_content: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  code_inline: {
    ...typography.code,
    backgroundColor: colors.surface,
    color: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    ...typography.code,
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  fence: {
    ...typography.code,
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  blockquote: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
});

