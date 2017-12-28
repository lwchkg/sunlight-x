-module(talk2).
-compile(export_all).
start() ->
    OtherNode = clean(io:get_line('What node? ')),
    FullNode = string:concat(OtherNode, "@localhost"),
    io:format("talking to: ~s~n", [FullNode]),
    register(receiver, spawn(?MODULE, receiver, [])),
    register(sender, spawn(?MODULE, sender, [list_to_atom(FullNode)])),
    get_input().
get_input() ->
    Message = clean(io:get_line('Talk: ')),
    case string:equal("exit!", Message) of
        true ->
            receiver ! done,
            sender ! done;
        false ->
            talk(Message),
            get_input()
    end.
talk(Message) ->
    sender ! {send, Message}.
sender(OtherNode) ->
    receive
        {send, Message} ->
            rpc:call(OtherNode, talk2, send_message, [Message]),
            sender(OtherNode);
        done ->
            void
    end.
% Add extra spaces after send_message to test the highlighter.
send_message    (Message) ->
    receiver ! {message, Message}.
% Remove the space between () and -> to test the highlighter.
receiver()->
    receive
        {message, Message} ->
            io:format("~s~n", [Message]),
            receiver();
        done ->
            void
    end.
clean(Data) ->
    string:strip(Data, both, $\n).
