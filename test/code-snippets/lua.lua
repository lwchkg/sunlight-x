--strings
a = 'alo\n123"'
a = "alo\n123\""
a = '\97lo\10\04923"'
a = [[alo
123"]]
a = [==[
alo
123"]==]

--[[
multi
line
comment]]

local BUFSIZE = 2^13         -- 8K
local f = io.input(arg[1])   -- open input file
local cc, lc, wc = 0, 0, 0   -- char, line, and word counts
while true do
    local lines, rest = f:read(BUFSIZE, "*line")
    if not lines then break end
    if rest then lines = lines .. rest .. '\n' end
    cc = cc + string.len(lines)
    -- count words in the chunk
    local _,t = string.gsub(lines, "%S+", "")
    wc = wc + t
    -- count newlines in the chunk
    _,t = string.gsub(lines, "\n", "\n")
    lc = lc + t
end
print(lc, wc, cc)

-- print the first non-empty line
repeat
    line = os.read()
until line ~= ""
print(line)

function sortbygrade(names, grades)
  table.sort(names, function(n1, n2)
    return grades[n1] > grades[n2]    -- compare the grades
  end)
end

-- Markov Chain Program in Lua

function allwords()
  local line = io.read()    -- current line
  local pos = 1             -- current position in the line
  return function ()        -- iterator function
    while line do           -- repeat while there are lines
      local s, e = string.find(line, "%w+", pos)
      if s then      -- found a word?
        pos = e + 1  -- update next position
        return string.sub(line, s, e)   -- return the word
      else
        line = io.read()    -- word not found; try next line
        pos = 1             -- restart from first position
      end
    end
    return nil            -- no more lines: end of traversal
  end
end

function prefix(w1, w2)
  return w1 .. ' ' .. w2
end

local statetab

function insert (index, value)
    if not statetab[index] then
        statetab[index] = {n=0}
    end
    table.insert(statetab[index], value)
end

local N  = 2
local MAXGEN = 10000
local NOWORD = "\n"

-- build table
statetab = {}
local w1, w2 = NOWORD, NOWORD
for w in allwords() do
    insert(prefix(w1, w2), w)
    w1 = w2; w2 = w;
end
insert(prefix(w1, w2), NOWORD)

-- generate text
w1 = NOWORD; w2 = NOWORD     -- reinitialize
for i=1,MAXGEN do
    local list = statetab[prefix(w1, w2)]
    -- choose a random item from list
    local r = math.random(table.getn(list))
    local nextword = list[r]
    if nextword == NOWORD then return end
    io.write(nextword, " ")
    w1 = w2; w2 = nextword
end

