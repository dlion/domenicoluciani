---
title: Create a DNS Resolver with Golang
description: 'Following the previous post about creating an Application Layer Load
  Balancer, today I''m going to share my journey about another challenge I took and
  completed: Create a simple…'
tags:
- engineering
- highlights
cover: "/assets/images/covers/dns.png"
hn_url: "https://news.ycombinator.com/item?id=43503561"
reddit_url: "https://www.reddit.com/r/golang/comments/1cnul9f/create_a_dns_resolver_with_go/"
---


Following the previous post about [creating an Application Layer Load Balancer](https://domenicoluciani.com/2024/02/12/creating-an-application-layer-load-balancer.html), today I'm going to share my journey about another challenge I took and completed:
**Create a simple DNS Resolver with Go**, let's go! 🚀

## DNS Resolver what?

A DNS Resolver is a crucial component that allows you to resolve an IP address from a certain domain.   
For instance, it allows your browser to know where to find the server associated with a specific domain.   
(i.e. domenicoluciani.com → 172.67.144.42)

## The Coding Challenge

The coding challenge consists of building a simple DNS Resolver that is capable of resolving an IP address from a certain domain. I'd like to highlight about the _simple_ part.   
You can find the challenge here: [https://codingchallenges.fyi/challenges/challenge-dns-resolver/](https://codingchallenges.fyi/challenges/challenge-dns-resolver/)

## Preface
As I did in the previous posts, I took this challenge just for fun and dive deeper into how a DNS resolver works. It's a weekend project that obviously can contain errors, so if you find one -or more-, please let me know, never stop learning, right? 📚

## Things I learned with this challenge

* Obviously, I learned **A LOT** about how a DNS Resolver works.
* How the name resolution works
* What encoding is used
* Went deeper into binary protocols and how they work
    * And how to fill a structure with binary data in Go.
* The [DNS RFC](https://datatracker.ietf.org/doc/html/rfc1035) is super clear (well done authors!)
* Testing and ChatGPT saved me from a lot of debugging time

Are you interested in one of these things? Then keep reading! 🕵🏻‍♂️

## Step 0

For this challenge, I decided to use Go and I tried to use a Test Driven Development approach as usual, even tho not completely since my goal wasn't to apply it perfectly but to have a good simple design. 🙏🏻

## Step 1
This step is about creating a query message that we have to send to the name server, composed of these fields:

1. A header.
2. A question section.
3. An answer section.
4. An authority section.
5. An additional section.


## Header
The header is always present, and it is composed in this way 

```
                                    1  1  1  1  1  1
      0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                      ID                       |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    QDCOUNT                    |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    ANCOUNT                    |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    NSCOUNT                    |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                    ARCOUNT                    |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
```

* Query ID
* Some flags (at the beginning for the challenge we set this flags to 1 and then to 0 because at the beginning we contact a dns resolver to then switch to an authoritative nameserver)
* QDCOUNT = Number of questions
* ANCOUNT = Number of answers
* NSCOUNT =  Number of authorities
* ARCOUNT = Number of additional

You can see the detail in the RFC, [section 4.1.1](https://datatracker.ietf.org/doc/html/rfc1035#section-4.1.1).

## Question

The question section is composed in this way:
```
                                    1  1  1  1  1  1
      0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                                               |
    /                     QNAME                     /
    /                                               /
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                     QTYPE                     |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
    |                     QCLASS                    |
    +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+

```
* QNAME = encoded name of the domain (i.e. `3dns6google3com`)
* QTYPE = the type of the query (i.e. `A`, `MX`, etc.)
* QCLASS = class type (i.e. `internet`)

The details are defined in these sections of the RFC: 
* Question: [https://datatracker.ietf.org/doc/html/rfc1035#section-4.1.2]( https://datatracker.ietf.org/doc/html/rfc1035#section-4.1.2)
* Type: [https://datatracker.ietf.org/doc/html/rfc1035#section-3.2.2](https://datatracker.ietf.org/doc/html/rfc1035#section-3.2.2)
* Class: [https://datatracker.ietf.org/doc/html/rfc1035#section-3.2.4](https://datatracker.ietf.org/doc/html/rfc1035#section-3.2.2)

## Query
Both sections need to be encoded in bytes and put together in order to form the final query.

When we send the request we don't don't need to compose authorities and additionals, they are going to be filled out in the response.

## Let's see the code 👀

Let's take a look at how I created and converted these two structures into bytes.

The test is quite minimal and simple:
```go
    t.Run("Should encode an header into bytes", func(t *testing.T) {
        header := NewHeader(22, RECURSION_FLAG, 1, 0, 0, 0)

        encodedHeader := header.ToBytes()

        expected, err := hex.DecodeString("0016010000010000000000000")
        assert.NotNil(t, err)
        assert.Equal(t, expected, encodedHeader)
    })
```

```go
const RECURSION_FLAG uint16 = 1 << 8

type Header struct {
    Id      uint16
    Flags   uint16
    QdCount uint16
    AnCount uint16
    NsCount uint16
    ArCount uint16
}
```
and then I implemented the function for the conversion:

```go
func (h *Header) ToBytes() []byte {
    encodedHeader := new(bytes.Buffer)
    binary.Write(encodedHeader, binary.BigEndian, h.Id)
    binary.Write(encodedHeader, binary.BigEndian, h.Flags)
    binary.Write(encodedHeader, binary.BigEndian, h.QdCount)
    binary.Write(encodedHeader, binary.BigEndian, h.AnCount)
    binary.Write(encodedHeader, binary.BigEndian, h.NsCount)
    binary.Write(encodedHeader, binary.BigEndian, h.ArCount)

    return encodedHeader.Bytes()
}
```

The go [encoding/binary](https://pkg.go.dev/encoding/binary) package was crucial to working with anything related to the binary encoding.   
Basically, I just append into `encodedHeader` `bytes.Buffer` whatever I have on each field of the struct using a Big-endian order.

I have done the same thing for the question part:
```go
    t.Run("Should encode a question into bytes", func(t *testing.T) {
        question := NewQuestion("dns.google.com", TYPE_A, CLASS_IN)

        encodedQuestion := question.ToBytes()

        expected, _ := hex.DecodeString("03646e7306676f6f676c6503636f6d0000010001")
        assert.NotNil(t, expected)
        assert.Equal(t, expected, encodedQuestion)
    })
```
and the implementation

```go
func (q *Question) ToBytes() []byte {
    encodedQuestion := new(bytes.Buffer)
    binary.Write(encodedQuestion, binary.BigEndian, q.QName)
    binary.Write(encodedQuestion, binary.BigEndian, q.QType)
    binary.Write(encodedQuestion, binary.BigEndian, q.QClass)

    return encodedQuestion.Bytes()
}
```

One thing here is that we have to encode the domain name using a simple encoding algorithm, here the test:
```go
    t.Run("Should encode the dns name", func(t *testing.T) {
        encodedDnsName := encodeDnsName([]byte("dns.google.com"))
        assert.Equal(t, []byte("\x03dns\x06google\x03com\x00"), encodedDnsName)
    })
```

Basically we replace each dot with a number of characters we have right after it, so `dns.google.com` becomes `3dns6google3com`.

The implementation:

```go
func encodeDnsName(qname []byte) []byte {
    var encoded []byte
    parts := bytes.Split([]byte(qname), []byte{'.'})
    for _, part := range parts {
        encoded = append(encoded, byte(len(part)))
        encoded = append(encoded, part...)
    }
    return append(encoded, 0x00)
}
```

and now let's join both header and question together, the test:
```go
    t.Run("Should create a query", func(t *testing.T) {
        header := NewHeader(22, RECURSION_FLAG, 1, 0, 0, 0)
        question := NewQuestion("dns.google.com", TYPE_A, CLASS_IN)

        query := NewQuery(header, question)

        expected, err := hex.DecodeString("00160100000100000000000003646e7306676f6f676c6503636f6d0000010001")
        assert.Nil(t, err)
        assert.Equal(t, expected, query)
    })

```

and the resulting code:

```go
func NewQuery(header *Header, question *Question) []byte {
    var query []byte

    query = append(query, header.ToBytes()...)
    query = append(query, question.ToBytes()...)

    return query
}
```

## Step 2

Now we need to send our query over the network using the _UDP_ protocol and get back the response from the name server.   
The code is quite simple, I didn't want to spend much time on error checking tho, here is the implementation:

```go
type Client struct {
    serverAddress string
    port          int
}

func NewClient(address string, port int) *Client {
    return &Client{serverAddress: address, port: port}
}

func (c *Client) SendQuery(query []byte) []byte {
    conn, err := net.Dial("udp", fmt.Sprintf("%s:%d", c.serverAddress, c.port))
    if err != nil {
        fmt.Printf("Dial err %v\n", err)
        os.Exit(-1)
    }
    defer conn.Close()

    if _, err = conn.Write(query); err != nil {
        fmt.Printf("Write err %v\n", err)
        os.Exit(-1)
    }

    response := make([]byte, 1024)
    lengthOfTheResponse, err := conn.Read(response)
    if err != nil {
        fmt.Printf("Read err %v\n", err)
        os.Exit(-1)
    }

    if !hasTheSameID(query, response) {
        fmt.Printf("Response doesn't have the same ID of the query q:%v, r:%v\n", query, response)
        os.Exit(-1)
    }

    return response[:lengthOfTheResponse]
}
```

One check I had to implement due of requirements is about the query ID (it can be whatever), the one we send should be the same as the one that we receive from the server, here the test:

```go
    t.Run("Should check if the response starts with the same ID as the query", func(t *testing.T) {
        query, _ := hex.DecodeString("00160100000100000000000003646e7306676f6f676c6503636f6d0000010001")
        response, _ := hex.DecodeString("00168080000100020000000003646e7306676f6f676c6503636f6d0000010001c00c0001000100000214000408080808c00c0001000100000214000408080404")

        assert.True(t, hasTheSameID(query, response))
    })
```

and the implementation:
```go
func hasTheSameID(query, response []byte) bool {
    return slices.Equal(query[:2], response[:2])
}
```

## Step 3

Now our goal is to parse the response, the message luckily has the same structure as the one we sent, let's see how to parse the header:

```go
    t.Run("Should create an header from a response", func(t *testing.T) {
        response, _ := hex.DecodeString("001680800001000200000000")
        header, _ := ParseHeader(bytes.NewReader(response))

        assert.Equal(t, &Header{
            Id:      0x16,
            Flags:   1<<15 | 1<<7, // QR (Response) bit = 1, OPCODE = 0 (standard query), AA = 1, TC = 0, RD (Recursion Desired) bit = 1, RA = 1, Z = 0, RCODE = 0
            QdCount: 0x1,
            AnCount: 0x2,
            NsCount: 0x0,
            ArCount: 0x0,
        }, header)
    })
```
and the implementation:

```go
func ParseHeader(reader *bytes.Reader) (*Header, error) {
    var header Header

    binary.Read(reader, binary.BigEndian, &header.Id)
    binary.Read(reader, binary.BigEndian, &header.Flags)
    switch header.Flags & 0b1111 {
    case 1:
        return nil, errors.New("error with the query")
    case 2:
        return nil, errors.New("error with the server")
    case 3:
        return nil, errors.New("the domain doesn't exist")
    }
    binary.Read(reader, binary.BigEndian, &header.QdCount)
    binary.Read(reader, binary.BigEndian, &header.AnCount)
    binary.Read(reader, binary.BigEndian, &header.NsCount)
    binary.Read(reader, binary.BigEndian, &header.ArCount)

    return &header, nil
}
```

Thanks to the `encoding/binary` package we can easily get the information we need and store it into our structure.   
Here I also implemented a check to verify that the response didn't have  errors.
Thanks to ChatGPT I could easily generate the binary response for each use-case otherwise I would have had to do it by myself 😫

The tests are more or less like this:
```go
    t.Run("Should return an error if the header flags contains a query error", func(t *testing.T) {
        response, _ := hex.DecodeString("001680810001000200000000")

        header, err := ParseHeader(bytes.NewReader(response))

        assert.Nil(t, header)
        assert.NotNil(t, err)
        assert.EqualError(t, err, "error with the query")
    })

```

Now let's parse the rest of the message:
```go
func ParseQuestion(reader *bytes.Reader) *Question {
    var question Question

    question.QName = []byte(DecodeName(reader))
    binary.Read(reader, binary.BigEndian, &question.QType)
    binary.Read(reader, binary.BigEndian, &question.QClass)

    return &question
}
```

Here we see a `DecodeName` function, which is the most difficult part in terms of implementation for the DNS Resolver:

```go
func DecodeName(reader *bytes.Reader) string {
    var name bytes.Buffer

    for {
        lengthByte, _ := reader.ReadByte()

        if (lengthByte & 0xC0) == 0xC0 {
            name.WriteString(getBackTheDomainFromTheHeader(reader, lengthByte))
            break
        }

        if lengthByte == 0 {
            break
        }

        label := make([]byte, lengthByte)
        io.ReadFull(reader, label)
        name.Write(label)
        name.WriteByte('.')

    }

    result, _ := strings.CutSuffix(name.String(), ".")
    return result
}

func getBackTheDomainFromTheHeader(reader *bytes.Reader, lengthByte byte) string {
    nextByte, _ := reader.ReadByte()
    pointer := uint16((uint16(lengthByte) & 0x3F) | uint16(nextByte))

    currentPos, _ := reader.Seek(0, io.SeekCurrent)

    reader.Seek(int64(pointer), io.SeekStart)

    decodedName := DecodeName(reader)

    reader.Seek(currentPos, io.SeekStart)

    return decodedName
}
```

I created a recursive function for simplicity; basically if the buffer starts with `0xC0` it means we are in front of a “DNS compression algorithm”.   

The algorithm consists of a pointer towards the domain name we previously got in the buffer in order to not being repeated and save space. So, we calculate the offset, move there, read the domain name, and then get back to the original position, continuing with the parsing.   

Of course this is a very basic algorithm and it can lead to [multiple problems](https://jvns.ca/blog/2022/01/15/some-ways-dns-can-break/) (like for example a malicious server can create a pointer to itself creating an infinite loop but you know, it was out of the scope of this challenge 😇)

And last but not the least, let's parse the records we got:
```go

func TestResponse(t *testing.T) {
    t.Run("Should create a record from a response", func(t *testing.T) {
        response, _ := hex.DecodeString("00168080000100020000000003646e7306676f6f676c6503636f6d0000010001c00c0001000100000214000408080808c00c0001000100000214000408080404")
        reader := bytes.NewReader(response)
        const RECORD_STARTING_POINT = 32
        skipResponseTill(t, reader, response, RECORD_STARTING_POINT)

        record := ParseRecord(reader)

        assert.NotEmpty(t, record)
        assert.Equal(t, TYPE_A, record.Type)
        assert.Equal(t, CLASS_IN, record.Class)
        assert.Greater(t, record.TTL, uint32(0))
        assert.Greater(t, record.RdLength, uint16(0))
        assert.Equal(t, "8.8.8.8", record.Rdata)

        record = ParseRecord(reader)

        assert.NotEmpty(t, record)
        assert.Equal(t, TYPE_A, record.Type)
        assert.Equal(t, CLASS_IN, record.Class)
        assert.Greater(t, record.TTL, uint32(0))
        assert.Greater(t, record.RdLength, uint16(0))
        assert.Equal(t, "8.8.4.4", record.Rdata)
    })
}

func skipResponseTill(t *testing.T, reader *bytes.Reader, response []byte, startingPoint int64) {
    t.Helper()
    reader.ReadAt(response, startingPoint)
}
```
Here I could have added more tests and use-cases I know, I'll leave it to you as a homework. 😎

The implementation:
```go
type Record struct {
    Name     []byte
    Type     uint16
    Class    uint16
    TTL      uint32
    RdLength uint16
    Rdata    string
}

func ParseRecord(reader *bytes.Reader) *Record {
    var record Record
    record.Name = []byte(DecodeName(reader))
    binary.Read(reader, binary.BigEndian, &record.Type)
    binary.Read(reader, binary.BigEndian, &record.Class)
    binary.Read(reader, binary.BigEndian, &record.TTL)
    binary.Read(reader, binary.BigEndian, &record.RdLength)
    switch record.Type {
    case TYPE_A:
        record.Rdata = readIP(reader, record.RdLength)
    case TYPE_NS:
        record.Rdata = DecodeName(reader)
    default:
        record.Rdata = string(readData(reader, record.RdLength))
    }
    return &record
}

func readIP(reader *bytes.Reader, length uint16) string {
    dataBytes := readData(reader, length)
    return fmt.Sprintf("%d.%d.%d.%d", dataBytes[0], dataBytes[1], dataBytes[2], dataBytes[3])
}

func readData(reader *bytes.Reader, length uint16) []byte {
    dataBytes := make([]byte, length)
    binary.Read(reader, binary.BigEndian, &dataBytes)
    return dataBytes
}
```

Here we can see how we differentiate between `TYPE_A` and `TYPE_NS` in order to be able to decode the domain correctly. This is important because with the first type we get an IP, with the second a domain name.

The record part is the most important one because it might be:
* `ANSWER`: A list of IP addresses, basically what we are looking for
* `AUTHORITIES`: A list of NS servers that potentially can have what we are looking for
* `ADDITIONALS`: A list of IP addresses of the NS servers we got from the `AUTHORITITES` section.


## Let's put everything together
Now it's time to use all these function together:
```go
func resolve(domainName string, questionType uint16) string {
	nameServer := "198.41.0.4"
	for {
		fmt.Printf("Querying %s for %s\n", nameServer, domainName)
		dnsResponse := sendQuery(nameServer, domainName, questionType)
		dnsPacket := getDnsPacketFromResponse(dnsResponse)

		if ip := getAnswer(dnsPacket.answers); ip != "" {
			return ip
		}

		if nsIp := getNameServerIp(dnsPacket.additionals); nsIp != "" {
			nameServer = nsIp
			continue
		}

		if nsDomain := getNameServer(dnsPacket.authorities); nsDomain != "" {
			nameServer = resolve(nsDomain, packet.TYPE_A)
		}
	}
}
```

Where `SendQuery`:
```go
func sendQuery(nameServer, domainName string, questionType uint16) []byte {
	query := packet.NewQuery(
		packet.NewHeader(22, 0, 1, 0, 0, 0),
		packet.NewQuestion(domainName, questionType, packet.CLASS_IN),
	)

	client := network.NewClient(nameServer, 53)
	return client.SendQuery(query)
}
```

Creates the query from the header and the question and then send the query to the nameserver.

Then we get the `DNSPacket` from the response parsing it:
```go
func getDnsPacketFromResponse(dnsResponse []byte) *DNSPacket {
	var (
		header      *packet.Header
		questions   []*packet.Question
		answers     []*packet.Record
		authorities []*packet.Record
		additionals []*packet.Record
	)

	reader := bytes.NewReader(dnsResponse)
	header, err := packet.ParseHeader(reader)
	if err != nil {
		fmt.Printf("Can't parse the response header: %v\n", err)
		os.Exit(-1)
	}
	for range header.QdCount {
		questions = append(questions, packet.ParseQuestion(reader))
	}

	for range header.AnCount {
		answers = append(answers, packet.ParseRecord(reader))
	}

	for range header.NsCount {
		authorities = append(authorities, packet.ParseRecord(reader))
	}

	for range header.ArCount {
		additionals = append(additionals, packet.ParseRecord(reader))
	}

	return &DNSPacket{
		header:      header,
		questions:   questions,
		answers:     answers,
		authorities: authorities,
		additionals: additionals,
	}
}
```

and at the end we check what results we get from the other sections:
```go
func getAnswer(answers []*packet.Record) string {
	return getRecord(answers)
}

func getNameServerIp(additionals []*packet.Record) string {
	return getRecord(additionals)
}

func getNameServer(authorities []*packet.Record) string {
	return getRecord(authorities)
}

func getRecord(records []*packet.Record) string {
	for _, record := range records {
		if record.Type == packet.TYPE_A || record.Type == packet.TYPE_NS {
			return record.Rdata
		}
	}
	return ""
}
```

## The code and the output?

As always you can find the code on my Github, at this url: [https://github.com/dlion/unnije](https://github.com/dlion/unnije).

And the output looks like this:
```sh
dlion@darkness> unnije % ./unnije domenicoluciani.com
Querying 198.41.0.4 for domenicoluciani.com
Querying 192.41.162.30 for domenicoluciani.com
Querying 108.162.192.65 for domenicoluciani.com
104.21.47.30
```
or
```sh
dlion@darkness unnije % ./unnije domenicoluciani.com twitter.com
Querying 198.41.0.4 for domenicoluciani.com
Querying 192.41.162.30 for domenicoluciani.com
Querying 108.162.192.65 for domenicoluciani.com
172.67.144.42
Querying 198.41.0.4 for twitter.com
Querying 192.41.162.30 for twitter.com
Querying 198.41.0.4 for a.r06.twtrdns.net
Querying 192.55.83.30 for a.r06.twtrdns.net
Querying 205.251.195.207 for a.r06.twtrdns.net
Querying 205.251.192.179 for twitter.com
104.244.42.129
```

If we want to try providing more than one domain.

## Final thoughts and thank yous

I had lot of fun doing this challenge, I studied how the DNS works in the past but I've been so close to the actual implementation and I will never stop saying that theory is nothing without a good practice.   

Some articles I found helpful to understand better how to overcome this challenge:
* [DNS RFC](https://datatracker.ietf.org/doc/html/rfc1035)
* Julia Evans blog:
    * [https://jvns.ca/blog/2023/07/28/why-is-dns-still-hard-to-learn/](https://jvns.ca/blog/2023/07/28/why-is-dns-still-hard-to-learn/)
    * [https://jvns.ca/blog/2022/11/06/making-a-dns-query-in-ruby-from-scratch/](https://jvns.ca/blog/2022/11/06/making-a-dns-query-in-ruby-from-scratch/)
    * [https://jvns.ca/blog/2022/02/14/some-dns-terminology/](https://jvns.ca/blog/2022/02/14/some-dns-terminology/)
* ChatGPT

During this challenge I found extremely helpful pairing with ChatGPT, when using binary protocols having a `machine` that talk that language is key to dealing with problems and weird behaviors, but be careful using it if you are not sure about what you are doing, sometimes it allucinates and generates funny things. 🥸