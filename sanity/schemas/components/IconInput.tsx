import React, {useState, useMemo} from 'react'
import {Stack, TextInput, Card, Grid, Box, Text} from '@sanity/ui'
import {set, unset} from 'sanity'
import {StringInputProps} from 'sanity'
import * as TablerIcons from '@tabler/icons-react'

// Get all icon names
const iconNames = Object.keys(TablerIcons).filter(
  (name): name is keyof typeof TablerIcons => name.startsWith('Icon') && name !== 'IconProps',
)

const IconInput: React.FC<StringInputProps> = (props) => {
  const {value, onChange} = props
  const [search, setSearch] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const filteredIcons = useMemo(() => {
    if (!search) return iconNames.slice(0, 50) // Show first 50 by default

    const searchLower = search.toLowerCase()
    return iconNames.filter((name) => name.toLowerCase().includes(searchLower)).slice(0, 100) // Limit results
  }, [search])

  const handleSelect = (iconName: string) => {
    onChange(set(iconName))
    setIsOpen(false)
    setSearch('')
  }

  const handleClear = () => {
    onChange(unset())
    setSearch('')
  }

  // Get the selected icon component
  const getSelectedIcon = () => {
    if (!value || typeof value !== 'string') return null
    const icon = TablerIcons[value as keyof typeof TablerIcons]
    // Type guard to check if it's a valid React component
    if (typeof icon === 'function' || (icon && typeof icon === 'object' && '$typeof' in icon)) {
      return icon as React.ComponentType<{size?: number}>
    }
    return null
  }

  const SelectedIcon = getSelectedIcon()

  return (
    <Stack space={3}>
      <Stack space={2}>
        <TextInput
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.currentTarget.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Sök efter ikon..."
        />

        {value && (
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Box>
                <Text size={1} muted>
                  Vald ikon:
                </Text>
              </Box>
              <Stack space={2} style={{alignItems: 'flex-start'}}>
                {SelectedIcon && (
                  <Box style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <SelectedIcon size={24} />
                    <Text size={1}>{value}</Text>
                  </Box>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: 'white',
                  }}
                >
                  Rensa
                </button>
              </Stack>
            </Stack>
          </Card>
        )}
      </Stack>

      {isOpen && filteredIcons.length > 0 && (
        <Card
          padding={3}
          radius={2}
          shadow={2}
          style={{
            maxHeight: '400px',
            overflow: 'auto',
            position: 'relative',
            zIndex: 1000,
          }}
        >
          <Grid columns={[3, 4, 5, 6]} gap={2}>
            {filteredIcons.map((iconName) => {
              const IconComponent = TablerIcons[iconName] as React.ComponentType<{size?: number}>
              return (
                <Card
                  key={iconName}
                  as="button"
                  type="button"
                  padding={3}
                  radius={2}
                  tone={value === iconName ? 'primary' : 'default'}
                  onClick={() => handleSelect(iconName)}
                  style={{
                    cursor: 'pointer',
                    border: value === iconName ? '2px solid #2276fc' : '1px solid #e1e3e6',
                    background: value === iconName ? '#f1f5f9' : 'white',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (value !== iconName) {
                      e.currentTarget.style.background = '#f9fafb'
                      e.currentTarget.style.borderColor = '#cbd5e0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== iconName) {
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.borderColor = '#e1e3e6'
                    }
                  }}
                >
                  <Stack space={2} style={{alignItems: 'center'}}>
                    <IconComponent size={24} />
                    <Text
                      size={0}
                      style={{
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        fontSize: '10px',
                      }}
                    >
                      {iconName.replace('Icon', '')}
                    </Text>
                  </Stack>
                </Card>
              )
            })}
          </Grid>

          {search && filteredIcons.length === 0 && (
            <Box padding={4}>
              <Text align="center" muted>
                Inga ikoner hittades för "{search}"
              </Text>
            </Box>
          )}
        </Card>
      )}
    </Stack>
  )
}

export default IconInput
