import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TOptions } from 'i18next';

/**
 * A hook which returns a `t` function that inserts a prefix in each key lookup
 * @param prefix the prefix to use for all translation keys
 */
const usePrefixedTranslation = (prefix: string) => {
  const { t } = useTranslation();
  // the new `t` function that will append the prefix
  const translate = useCallback(
    (key: string, options?: string | TOptions<any> | undefined) => {
      // if the key contains a '.', then don't add the prefix
      const res = key.includes('.') ? t(key, options) : t(`${prefix}.${key}`, options);
      return res.toString();
    },
    [prefix, t],
  );

  return {
    l: translate,
  };
};

export default usePrefixedTranslation;
