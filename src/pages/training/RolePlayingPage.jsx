'use client';
import { useState, useEffect } from 'react';
import { sendRPMessage } from '../../api/rpService';
import { User, BarChart2, Volume2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { qaReport } from '../../api/qaService';
import { useToast } from '../../components/common/ToastProvider.jsx';
import RPCoPilotModal from '../../features/rpCopilot/RPCoPilotModal.jsx';


const PERSONAS = [
    {
        id: 'angry',
        name: '악성 민원 고객',
        desc: '매우 화가 난 상태입니다. 욕설을 할 수도 있습니다.',
        difficulty: 'Hard',
        tone: 'Aggressive',
        color: 'bg-red-500',
        icon: <Volume2 size={32} />
    },
    {
        id: 'vip',
        name: 'VIP 고객 (김철수님)',
        desc: '특별한 대우를 원하며, 절차를 건너뛰고 싶어합니다.',
        difficulty: 'Normal',
        tone: 'Demanding',
        color: 'bg-purple-500',
        icon: <User size={32} />
    },
    {
        id: 'elderly',
        name: '고령 고객',
        desc: '앱 사용이 익숙지 않아 천천히 반복적인 설명이 필요합니다.',
        difficulty: 'Easy',
        tone: 'Confused',
        color: 'bg-emerald-500',
        icon: <Globe size={32} />
    }
];

export default function RolePlayingPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const { addToast } = useToast();
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [callStatus, setCallStatus] = useState('idle'); // idle | connecting | active | ended
    const [duration, setDuration] = useState(0);

    const [qaOpen, setQaOpen] = useState(false);
    const [qaLoading, setQaLoading] = useState(false);
    const [qaData, setQaData] = useState(null);
    const [qaError, setQaError] = useState('');
    const [openExpertIndex, setOpenExpertIndex] = useState(null);
    const [aiTyping, setAiTyping] = useState(false);
    const [rpCopilotOpen, setRpCopilotOpen] = useState(false);


    const sendMessage = async (text, options = {}) => {
        const { showUser = true, start = false, personaOverride = null } = options;
        const persona = personaOverride || selectedPersona;

        if (!persona) {
            addToast('페르소나가 선택되지 않았습니다.', 'error');
            return;
        }

        if (showUser) {
            const userMsg = { role: 'user', content: text };
            setMessages(prev => [...prev, userMsg]);
        }

        setAiTyping(true);

        try {
            const data = await sendRPMessage({
                sessionId: persona.id,
                message: text,
                persona: {
                    id: persona.id,
                    name: persona.name,
                    desc: persona.desc,
                    tone: persona.tone,
                    difficulty: persona.difficulty,
                },
                start,
            });

            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: data.message },
            ]);
        } catch (e) {
            console.error("RP Error Details:", e);
            addToast(`AI 응답 오류: ${e.message}`, 'error');
        } finally {
            setAiTyping(false);
        }
    };

    // Timer logic
    useEffect(() => {
        let interval;
        if (callStatus === 'active') {
            interval = setInterval(() => setDuration(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);



    const formatTime = (sec) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartCall = (persona) => {
        setSelectedPersona(persona);
        setCallStatus('connecting');
        setRpCopilotOpen(true);
        setTimeout(() => {
            setCallStatus('active');
            addToast(`${persona.name}님과 연결되었습니다.`, 'success');
            sendMessage('통화가 시작되었습니다. 고객이 먼저 인사와 문의를 시작해 주세요.', {
                showUser: false,
                start: true,
                personaOverride: persona,
            });
        }, 2000); // Mock connection delay
    };

    const handleEndCall = async () => {
        setCallStatus('ended');
        addToast('통화가 종료되었습니다. QA 분석을 시작합니다.', 'info');

        setQaData(null);
        setQaOpen(true);
        setQaLoading(true);
        setQaError('');

        try {
            const report = await qaReport({
                session_id: selectedPersona.id,   // 또는 고유 call_id
                messages,
                memory: null,                     // 지금은 없으면 null
                max_turn_evals: 10,
                use_keyword_pick: true,
            });

            setQaData(report);
        } catch (e) {
            console.error(e);
            setQaError('QA 리포트 생성 중 오류가 발생했습니다.');
        } finally {
            setQaLoading(false);
        }
    };


    const resetCall = () => {
        setCallStatus('idle');
        setDuration(0);
        setSelectedPersona(null);
        setAiTyping(false);
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6 shrink-0">
                <div>
                    <div className="text-sm text-slate-500 font-bold mb-1">AI Roleplay Simulation</div>
                    <h1 className="text-2xl font-black text-slate-900">실전 AI 트레이닝</h1>
                    <p className="text-slate-600 mt-1">다양한 AI 고객 페르소나와 실시간 채팅으로 대화하며 대응 능력을 키우세요.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {callStatus === 'idle' ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {PERSONAS.map(persona => (
                            <div
                                key={persona.id}
                                onClick={() => handleStartCall(persona)}
                                className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className={`absolute top-0 right-0 p-32 rounded-full opacity-5 blur-3xl group-hover:opacity-10 transition-opacity ${persona.color}`} />

                                <div
                                    className={`w-16 h-16 rounded-2xl ${persona.color} bg-opacity-10 flex items-center justify-center text-slate-700 mb-6 group-hover:scale-110 transition-transform`}>
                                    <div className={`${persona.color.replace('bg-', 'text-')}`}>
                                        {persona.icon}
                                    </div>
                                </div>

                                <div className="mb-2 flex items-center justify-between">
                                    <span
                                        className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${persona.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                                            persona.difficulty === 'Normal' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                        {persona.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{persona.name}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6 h-10">{persona.desc}</p>

                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <BarChart2 size={14} />
                                    <span>성향: {persona.tone}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex-1" />
                )}
            </AnimatePresence>

            {qaOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-black mb-4">QA 리포트</h2>

                        {qaLoading && <p>분석 중...</p>}
                        {qaError && <p className="text-red-500">{qaError}</p>}

                        {qaData && (
                            <>
                                <p className="font-bold mb-2">
                                    종합 점수: {qaData.overall.overall_score} / 5
                                </p>

                                <p className="text-slate-600 text-sm mb-4">
                                    {qaData.overall.one_line_feedback}
                                </p>

                                <div className="space-y-8 mb-6">

                                    {/* ================= 잘한 문장 ================= */}
                                    <div>
                                        <h4 className="font-bold mb-3">👍 잘한 문장</h4>

                                        <div className="space-y-3">
                                            {qaData.top_sentences.map((s, i) => (
                                                <div
                                                    key={i}
                                                    className="border rounded-xl p-4 bg-green-50"
                                                >
                                                    <p className="text-sm text-slate-500 mb-1">상담사 발화</p>
                                                    <p className="font-medium mb-2">“{s.agent_utterance}”</p>

                                                    {/* 왜 잘했는지 */}
                                                    {s.positive_feedback && (
                                                        <p className="text-sm text-green-700">
                                                            ✔ {s.positive_feedback}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ================= 고쳐야 할 문장 ================= */}
                                    <div>
                                        <h4 className="font-bold mb-3">🔧 고쳐야 할 문장</h4>

                                        <div className="space-y-4">
                                            {qaData.bottom_sentences.map((s, i) => {
                                                const isOpen = openExpertIndex === i;

                                                return (
                                                    <div
                                                        key={i}
                                                        className="border rounded-xl p-4 bg-slate-50"
                                                    >
                                                        <p className="text-sm text-slate-500 mb-1">상담사 발화</p>
                                                        <p className="font-medium mb-2">“{s.agent_utterance}”</p>

                                                        {/* 왜 고쳐야 하는지 */}
                                                        {s.negative_feedback && (
                                                            <p className="text-sm text-slate-700 mb-3">
                                                                ⚠️ {s.negative_feedback}
                                                            </p>
                                                        )}

                                                        {/* 전문가 답변 토글 */}
                                                        <button
                                                            onClick={() => setOpenExpertIndex(isOpen ? null : i)}
                                                            className="text-sm font-bold text-blue-600 hover:underline"
                                                        >
                                                            {isOpen ? '전문가 답변 닫기 ▲' : '전문가 답변 보기 ▼'}
                                                        </button>

                                                        {/* 전문가 답변 */}
                                                        {isOpen && (
                                                            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                                                <p className="text-sm font-bold mb-1">
                                                                    💡 이렇게 말해보세요
                                                                </p>
                                                                <p className="text-sm whitespace-pre-line">
                                                                    {s.expert_recommended_response}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>



                                <div>
                                    <h4 className="font-bold mb-2">🎯 성장 포인트</h4>
                                    {qaData.growth_points.map((g, i) => (
                                        <p key={i} className="text-sm mb-1">
                                            <b>{g.focus}</b> – {g.how}
                                        </p>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 rounded-lg bg-slate-200"
                                onClick={() => {
                                    setQaOpen(false);
                                    resetCall();
                                    setMessages([]);
                                }}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ✅ QA 모달 끝 */}

            <RPCoPilotModal
                open={rpCopilotOpen}
                setOpen={setRpCopilotOpen}
                messages={messages}
                persona={selectedPersona}
                callStatus={callStatus}
                duration={duration}
                input={input}
                setInput={setInput}
                onSend={(text) => sendMessage(text)}
                aiTyping={aiTyping}
                onEndCall={handleEndCall}
            />

        </div>
    );
}
